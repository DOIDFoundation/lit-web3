import { TailwindElement, customElement, html, state, property } from '../shared/TailwindElement'
// Components
import '../img/loader'

@customElement('dui-audio')
export class DuiAudeo extends TailwindElement('') {
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

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`<audio
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
    ></audio>`
  }
}
