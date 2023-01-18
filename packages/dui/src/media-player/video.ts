import { TailwindElement, customElement, html, state, property, ref, Ref, createRef } from '../shared/TailwindElement'

@customElement('dui-video')
export class DuiVideo extends TailwindElement('') {
  el$: Ref<HTMLVideoElement> = createRef()
  @property({ type: String }) poster?: string
  @property({ type: String }) src?: string
  @property({ type: Boolean }) autoplay = false
  @state() playing: boolean = false

  oncontextmenu = (e: Event) => {
    e.preventDefault()
    e.stopImmediatePropagation()
  }
  onplay = (e: Event) => {
    console.log('play')
  }
  onpause = (e: Event) => {
    console.log('pause')
  }
  play = async () => {
    await 0
    this.el$.value?.play()
  }
  stop = async () => {
    await 0
    this.el$.value?.pause()
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`<video
      ${ref(this.el$)}
      class="w-full h-full"
      src=${this.src}
      @play=${this.onplay}
      @pause=${this.onpause}
      @contextmenu=${this.oncontextmenu}
      muted
      ?autoplay=${this.autoplay}
      ?controls=${this.autoplay}
      ?poster=${this.poster}
      loop
      webkit-playsinline
      playsinline
      controlslist="nodownload"
      preload="metadata"
      disablepictureinpicture
    ></video>`
  }
}
