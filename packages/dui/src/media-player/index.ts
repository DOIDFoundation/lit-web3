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
import emitter from '@lit-web3/core/src/emitter'
// Components
import '../img/loader'
import './video'
import './audio'
// Styles
import style from './media-player.css?inline'

@customElement('dui-media-player')
export class DuiMediaPlayer extends TailwindElement(style) {
  player$: any = createRef()
  @property({ type: String }) class = ''
  @property({ type: Object }) meta?: Meta
  @property({ type: String }) src?: string
  @property({ type: Boolean }) autoplay = false
  @state() playing: boolean = false
  @state() mediaType?: MediaType

  elId = Math.random().toString()

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
  get showPlayBtn() {
    return !this.autoplay && [NFTType.video, NFTType.audio].includes(this.mediaType as NFTType)
  }
  get showRawInPlace() {
    return (
      (this.autoplay || this.playing) &&
      [NFTType.video, NFTType.audio, NFTType.threed].includes(this.mediaType as NFTType)
    )
  }
  get zoomAble() {
    return [NFTType.image].includes(this.mediaType as NFTType)
  }

  updateMediaType = async () => {
    if (!this.mediaType && this.raw) this.mediaType = this.meta?.mediaType ?? (await fetchMediaType(this.raw))
  }
  play = async () => {
    emitter.emit('media-play', this.elId)
    this.playing = true
    await 0
    this.player$?.value?.play()
  }
  stop = (e?: CustomEventInit) => {
    if (e?.detail && e?.detail === this.elId) return
    this.playing = false
    this.player$?.value?.stop()
  }
  toggle = async () => {
    this[this.playing ? 'stop' : 'play']()
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
    emitter.on('media-play', this.stop)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    emitter.off('media-play', this.stop)
  }

  render() {
    return html`<div class="media-player w-full h-full mx-auto relative select-none ${classMap(this.$c([this.class]))}">
      <!-- Poster of nft -->
      ${when(
        this.showPoster,
        () => html`<img-loader class="poster w-full h-full" src=${this.poster} loading="lazy"></img-loader>`
      )}
      <!-- Show raw in current place (instead of poster) -->
      ${when(
        this.showRawInPlace,
        () =>
          html`${choose(this.mediaType, [
            [
              'audio',
              () => html`<dui-audio ${ref(this.player$)} src=${this.raw} ?autoplay=${this.autoplay}></dui-audio>`
            ],
            ['threed', () => html``],
            [
              'video',
              () => html`<dui-video ${ref(this.player$)} src=${this.raw} ?autoplay=${this.autoplay}></dui-video>`
            ]
          ])}`
      )}
      <!-- Player cover -->
      <div
        class="top-0 left-0 absolute w-full h-full ${classMap({
          'cursor-pointer': !this.showPlayBtn && !'zoom-in-unavailable'
        })}"
        @click=${this.toggle}
      >
        <!-- Play button -->
        ${when(
          this.showPlayBtn,
          () => html` <div
            class="play-btn flex justify-center items-center w-8 h-8 right-2 bottom-2 absolute z-10 bg-black text-2xl rounded-full"
          >
            <svg viewBox="0 0 36 36">
              <path
                fill="#fff"
                d=${this.playing
                  ? 'M12,26 16,26 16,10 12,10zM21,26 25,26 25,10 21,10z'
                  : 'M13.75,26 20.25,22 20.25,14 13.75,10zM20.25,22 25,18 25,18 20.25,14z'}
              ></path>
            </svg>
          </div>`
        )}
      </div>
      <!-- Zoom in in dialog -->
      ${when(this.zoomAble, () => html``)}
    </div>`
  }
}
