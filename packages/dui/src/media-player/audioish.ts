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
    played = false

    oncontextmenu = (e: Event) => {
      e.preventDefault()
      e.stopImmediatePropagation()
    }
    onplay = (e: Event) => {}
    play = async () => {
      await 0
      this.played = true
      this.el$?.value?.play()
      this.emit('play')
    }
    stop = () => {
      this.el$?.value?.pause()
      this.emit('stop')
    }
    _autoplay = () => {
      if (this.played || !this.autoplay) return
      if (this.el$.value) this.el$.value.muted = !screen.interacted
      this.play()
    }

    render() {
      return html`<${this.tag}
        ${ref(this.el$)}
        class="w-full h-full"
        src=${this.src}
        @error=${this.stop}
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
