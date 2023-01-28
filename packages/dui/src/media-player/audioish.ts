import { TAILWINDELEMENT, state, property, ref, Ref, createRef } from '../shared/TailwindElement'
import { html, unsafeStatic } from 'lit/static-html.js'
import { screen } from '@lit-web3/core/src/screen'

declare class PlayPauseAbleElementClass {}
export const PlayPauseAbleElement = <T extends PublicConstructor<TAILWINDELEMENT>>(
  superClass: T,
  { tag = 'video' } = {}
) => {
  class myMixin extends superClass {
    el$: Ref<HTMLVideoElement> = createRef()
    @property({ type: String }) poster?: string
    @property({ type: String }) src?: string
    @property({ type: Boolean }) autoplay = false
    @state() playing: boolean = false

    tag = unsafeStatic(tag)

    oncontextmenu = (e: Event) => {
      e.preventDefault()
      e.stopImmediatePropagation()
    }
    onplay = (e: Event) => {}
    onpause = (e: Event) => {}
    play = async () => {
      await 0
      this.el$.value?.play()
    }
    stop = async () => {
      await 0
      this.el$.value?.pause()
    }
    _autoplay = () => {
      if (!this.autoplay) return
      if (this.el$.value) this.el$.value.muted = !screen.interacted
      this.play()
    }

    connectedCallback() {
      super.connectedCallback()
    }
    render() {
      return html`<${this.tag}
        ${ref(this.el$)}
        class="w-full h-full"
        src=${this.src}
        @play=${this.onplay}
        @pause=${this.onpause}
        @contextmenu=${this.oncontextmenu}
        ?autoplay=${this.autoplay}
        ?controls=${this.autoplay}
        ?poster=${this.poster}
        loop
        webkit-playsinline
        playsinline
        controlslist="nodownload"
        preload="metadata"
        disablepictureinpicture
        @canplay=${this._autoplay}
      ></${this.tag}>`
    }
  }
  return myMixin as PublicConstructor<PlayPauseAbleElementClass> & T
}
