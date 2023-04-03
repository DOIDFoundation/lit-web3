import {
  TailwindElement,
  customElement,
  html,
  property,
  when,
  classMap,
  state,
  ifDefined,
  Ref,
  ref,
  createRef
} from '../shared/TailwindElement'
import { isInstantUri } from '@lit-web3/core/src/uri'
import { LazyElement } from '../shared/LazyElement'
import comporess from './compress'
// Styles
import style from './loader.css?inline'

const resizePoints = [48, 64, 128, 256, 384, 512, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]
@customElement('img-loader')
export class ImgLoader extends LazyElement(TailwindElement(style)) {
  el$: Ref<HTMLElement> = createRef()
  @property({ type: String, attribute: true }) src?: string
  @property({ type: Boolean }) loaded = false
  @property({ type: Boolean }) stop = false
  @property({ type: String }) loading = 'eager'
  @property({ type: String }) sizes? = undefined // default: auto, eg. sizes="(max-width: 600px) 200px, 380px"
  @state() w: string = '100%'
  @state() firstLoaded = this.loaded
  @state() imgLoaded = this.loaded
  @state() err = false
  @state() show = false
  @state() blobSrc = ''

  get lazy() {
    return this.loading === 'lazy'
  }
  get isInstantSrc() {
    return isInstantUri(this.src)
  }
  get isResizableSrc() {
    return this.src && /\?(w|width)=/.test(this.src)
  }
  get requireComporess() {
    return !this.isResizableSrc && !this.isInstantSrc && !this.blobSrc
  }
  get uri() {
    if (this.err || !this.show) return
    return this.requireComporess ? this.blobSrc : this.src
  }
  get empty() {
    return !(this.src || this.blobSrc) || !(this.uri || this.uriset)
  }
  get uriset() {
    if (!this.src || this.err || !this.show || !this.isResizableSrc) return
    const { origin, pathname } = new URL(this.src)
    return resizePoints.map((r) => `${[origin + pathname]}?auto=format&w=${r}&width=${r} ${r}w`).join(',')
  }
  get autoSizes() {
    return this.sizes ? this.sizes : `(max-width: 768px) ${this.w}px, ${this.w}px`
  }

  onLoad = () => {
    this.emit('loaded', (this.imgLoaded = this.firstLoaded = true))
  }
  onError = () => {
    this.err = false
  }

  override onObserved = () => {
    this.w = (this.el$.value?.getBoundingClientRect().width ?? '400') + ''
    this.show = true
  }

  protected shouldUpdate(props: Map<PropertyKey, unknown>): boolean {
    if (props.has('src') && this.requireComporess) {
      if (this.src) comporess(this.src).then((src) => (this.blobSrc = src))
    }
    return true
  }

  connectedCallback() {
    super.connectedCallback()
    if (this.loading === 'eager') this.onObserved()
  }

  render() {
    return html`<i
      ${ref(this.el$)}
      class="${classMap({ loaded: this.firstLoaded, err: this.err, empty: this.empty, stop: this.stop })}"
      >${when(
        this.isResizableSrc ? this.uriset : this.uri,
        () => html`<img
          class="${classMap({ invisible: !this.firstLoaded, 'opacity-0': !this.firstLoaded })}"
          src=${ifDefined(this.uri)}
          srcset=${ifDefined(this.uriset)}
          sizes=${ifDefined(this.autoSizes)}
          @load=${this.onLoad}
          @error=${this.onError}
        />`
      )}</i
    >`
  }
}
