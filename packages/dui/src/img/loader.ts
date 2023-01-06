import {
  TailwindElement,
  customElement,
  html,
  property,
  when,
  classMap,
  state,
  ref,
  createRef,
  Ref
} from '../shared/TailwindElement'
// Styles
import style from './loader.css'

@customElement('img-loader')
export class ImgLoader extends TailwindElement(style) {
  @property() src = ''
  @property() loaded = false
  @property() stop = false
  @property({ type: String }) loading = 'eager'
  @state() firstLoaded = this.loaded
  @state() imgLoaded = this.loaded
  @state() err = false
  @state() show = false

  el$: Ref<HTMLElement> = createRef()

  get lazy() {
    return this.loading === 'lazy'
  }
  get uri() {
    if (!this.show || this.err) return ''
    return this.src
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

  observer?: IntersectionObserver
  unobserve = () => this.el$?.value && this.observer?.unobserve(this.el$.value!)
  observe = () => {
    if (!this.lazy || this.observer) return
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return
      this.show = true
      this.unobserve()
    })
    this.observer.observe(this.el$.value!)
  }

  firstUpdated() {
    this.observe()
  }

  connectedCallback() {
    super.connectedCallback()
    this.show = this.loading === 'eager'
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    this.unobserve()
  }

  render() {
    return html`<i
      ${ref(this.el$)}
      class="${classMap({ loaded: this.firstLoaded, err: this.err, empty: this.empty, stop: this.stop })}"
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
