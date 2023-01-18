import {
  TailwindElement,
  customElement,
  html,
  state,
  classMap,
  choose,
  property,
  when,
  ref,
  createRef
} from '../shared/TailwindElement'
import { NFTType, MediaType, fetchMediaType } from '@lit-web3/core/src/MIMETypes'
// Components
import '../img/loader'
import './video'
import './audio'
// Styles
import style from './media-player.css?inline'

@customElement('dui-media-player')
export class DuiMediaPlayer extends TailwindElement(style) {
  el$: any = createRef()
  @property({ type: String }) class = ''
  @property({ type: Object }) meta?: Meta
  @property({ type: String }) src?: string
  @property({ type: Boolean }) autoplay = false
  @state() playing: boolean = false
  @state() mediaType?: MediaType

  get poster() {
    return this.meta?.image || this.src
  }
  get raw() {
    return this.meta?.raw || this.src
  }
  get showPoster() {
    return (
      (!this.autoplay && (this.mediaType !== NFTType.video || !this.playing)) ||
      [NFTType.image, NFTType.audio].includes(this.mediaType as NFTType)
    )
  }
  get showPlay() {
    return !this.autoplay || [NFTType.image, NFTType.audio].includes(this.mediaType as NFTType)
  }
  get showRaw() {
    return this.autoplay || this.playing
  }

  updateMediaType = async () => {
    if (!this.mediaType && this.raw) this.mediaType = this.meta?.mediaType ?? (await fetchMediaType(this.raw))
  }
  play = async () => {
    const method = this.playing ? 'stop' : 'play'
    this.playing = !this.playing
    await 0
    this.el$.value?.[method]()
  }

  protected shouldUpdate(props: Map<PropertyKey, unknown>): boolean {
    if (props.has('meta') || props.has('src')) {
      this.updateMediaType()
    }
    return true
  }

  connectedCallback() {
    super.connectedCallback()
    this.updateMediaType()
  }

  render() {
    return html`<div class="media-player w-full h-full mx-auto relative ${classMap(this.$c([this.class]))}">
      <!-- Poster of nft -->
      ${when(
        this.showPoster,
        () => html`<img-loader class="poster w-full h-full" src=${this.poster} loading="lazy"></img-loader>`
      )}
      <!-- Raw of nft -->
      ${when(
        this.showRaw,
        () =>
          html`${choose(this.mediaType, [
            ['audio', () => html`<dui-audio ${ref(this.el$)} src=${this.raw} ?autoplay=${this.autoplay}></dui-audio>`],
            ['image', () => html``],
            ['threed', () => html``],
            ['video', () => html`<dui-video ${ref(this.el$)} src=${this.raw} ?autoplay=${this.autoplay}></dui-video>`]
          ])}`
      )}
      <!-- Play button -->
      ${when(
        this.showPlay,
        () => html`<div
          class="play-btn flex justify-center items-center w-8 h-8 right-2 bottom-2 absolute z-10 bg-black text-2xl rounded-full"
          @click=${this.play}
        >
          <i class="mdi ${classMap(this.$c([this.playing ? 'mdi-pause' : 'mdi-play']))}"></i>
        </div>`
      )}
    </div>`
  }
}
