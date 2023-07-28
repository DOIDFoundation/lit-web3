import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  repeat,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import '@lit-web3/dui/src/input/pwd'
import { PHRASE_LEN_MAP, validatePhrase } from '~/lib.next/keyring/phrase'

import style from './phrase.css?inline'
@customElement('phrase-to-secret')
export class PhraseToSecret extends TailwindElement(style) {
  @property() class = ''
  @property({ type: String }) doid? = ''
  @property({ type: Number }) length = PHRASE_LEN_MAP[0]
  @property({ type: Boolean }) pending? = false
  @state() phrases = Array(this.length).fill('')
  @state() secret: any = null
  @state() ts = 0

  get phrase() {
    return this.phrases.join(' ')
  }
  get fullFilled() {
    return !this.phrases.some((r) => !r)
  }
  get wordInvalid() {
    return validatePhrase(this.phrase)
  }
  get err() {
    if (this.ts == 0) return ''
    let msg = ''
    if (!this.fullFilled) msg = `Secret Recovery Phrases contain ${this.length} words`
    else if (this.wordInvalid) msg = `Invalid Secret Recovery Phrase`
    return msg
  }

  chk() {
    this.emit('change', {
      phrase: !this.err ? this.phrases.join(' ') : '',
      error: this.err
    })
  }
  onInput = async (e: CustomEvent, idx: number) => {
    this.ts++
    this.phrases[idx] = e.detail
    this.phrases = [...this.phrases]
    this.chk()
  }
  onPaste = (e: ClipboardEvent) => {
    this.ts++
    e.preventDefault()
    const text = (e.clipboardData || (window as any).clipboardData).getData('text')
    const ele = e.target as HTMLElement
    const phrases = text.split(' ')
    const limitLen = this.length
    const inputLen = phrases.length
    phrases.splice(limitLen)
    const gapLen = limitLen - inputLen
    this.phrases = [...phrases.concat(Array(gapLen).fill(''))]
    ele.blur()
    this.chk()
  }
  submit() {
    this.chk()
  }
  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`<div class="my-4 ${classMap(this.$c([this.class]))}"></div>
      <slot name="tip"></slot>
      <div class="grid grid-cols-2 lg_grid-cols-3 gap-4 my-4 lg_m-4">
        ${repeat(
          this.phrases,
          (phrases: string, idx: number) => html`<div class="flex items-center gap-2 lg_gap-4">
            <b class="block w-4 shrink-0 text-xs lg_text-base">${idx + 1}.</b>
            <dui-input-pwd
              .idx=${idx}
              dense
              ?autofocus=${idx === 0}
              type="password"
              @input=${(e: CustomEvent) => this.onInput(e, idx)}
              @paste=${this.onPaste}
              @submit=${this.submit}
              .value=${phrases}
              ?disabled=${this.pending}
            >
            </dui-input-pwd>
          </div>`
        )}
      </div>
      <div class="w-full text-red-500">${this.err}</div>
    </div>`
  }
}
