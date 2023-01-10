import { TailwindElement, customElement, html, property, when, classMap, state } from '../shared/TailwindElement'
import { LazyElement } from '../shared/LazyElement'
import comporess from './compress'
// Styles
import style from './loader.css?inline'

@customElement('img-loader')
export class ImgLoader extends LazyElement(TailwindElement(style)) {
  @property({ type: String }) src = ''
  @property() loaded = false
  @property() stop = false
  @property({ type: String }) loading = 'eager'
  @state() firstLoaded = this.loaded
  @state() imgLoaded = this.loaded
  @state() err = false
  @state() show = false
  @state() blobSrc = ''

  get lazy() {
    return this.loading === 'lazy'
  }
  get requireComporess() {
    return this.src && !/\?(w|width)=/.test(this.src) && !this.blobSrc
  }
  get uri() {
    if (!this.show || this.err) return ''
    return this.requireComporess ? this.blobSrc : this.src
  }
  get empty() {
    return !this.src || !this.uri
  }

  onLoad = () => {
    this.emit('loaded', (this.imgLoaded = this.firstLoaded = true))
  }
  onError = () => {
    this.err = false
  }

  override onObserved = () => {
    this.show = true
  }

  protected shouldUpdate(props: Map<PropertyKey, unknown>): boolean {
    if (props.has('src') && this.requireComporess) {
      comporess(this.src).then((src) => (this.blobSrc = src))
    }
    return true
  }

  connectedCallback() {
    super.connectedCallback()
    this.show = this.loading === 'eager'
  }

  render() {
    return html`<i class="${classMap({ loaded: this.firstLoaded, err: this.err, empty: this.empty, stop: this.stop })}"
      >${when(
        this.uri,
        () => html`<img
          class="${classMap({ invisible: !this.firstLoaded, 'opacity-0': !this.firstLoaded })}"
          src=${this.uri}
          @load=${this.onLoad}
          @error=${this.onError}
        />`
      )}</i
    >`
  }
}
