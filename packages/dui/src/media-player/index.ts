import {
  TailwindElement,
  customElement,
  html,
  state,
  classMap,
  choose,
  property,
  when
} from '../shared/TailwindElement'
import { MediaType, fetchMediaType } from '@lit-web3/core/src/MIMETypes'
// Components
import '../img/loader'
import './video'
import './audio'
// Styles
import style from './media-player.css?inline'

@customElement('dui-media-player')
export class DuiMediaPlayer extends TailwindElement(style) {
  // el$: Ref<HTMLElement> = createRef()
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
  // get mediaType() {
  //   return this.meta?.mediaType ?? getNFTType(this.raw) ?? 'image'
  // }
  get showPoster() {
    return !this.autoplay || ['image', 'audio'].includes(this.mediaType as string)
  }

  updateMediaType = async () => {
    if (!this.mediaType && this.raw) this.mediaType = this.meta?.mediaType ?? (await fetchMediaType(this.raw))
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
      ${when(
        this.autoplay,
        () => html`<!-- Raw of nft -->
          ${choose(this.mediaType, [
            ['audio', () => html`<dui-audio src=${this.raw} autoplay></dui-audio>`],
            ['image', () => html``],
            ['threed', () => html``],
            ['video', () => html`<dui-video src=${this.raw} autoplay></dui-video>`]
          ])}`,
        () => html`<!-- Play button -->
          <div class="right-4 bottom-4 absolute z-10 bg-black">
            <i class="mdi ${classMap({ 'mdi-play': this.playing })}"></i>
          </div>`
      )}
    </div>`
  }
}
