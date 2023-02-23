import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  repeat,
  when
} from '@lit-web3/dui/src/shared/TailwindElement'
import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/input/pwd'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/link'
import { PHRASE_LEN_MAP, getKey } from '@/lib/phrase'
import { chkPwdValid } from '@/lib/utils'

import style from './restore.css?inline'
@customElement('view-restore')
export class ViewRestore extends TailwindElement(style) {
  @property() placeholder = ''
  @property() phraseLen = PHRASE_LEN_MAP[0]

  @state() name = ''
  @state() pwd = ''
  @state() pwdconfirm = ''
  @state() toggle = { pwd: true, confirm: true }
  @state() err = ''
  @state() invalid: Record<string, string> = { pwd: '', pwdconfirm: '' }
  @state() pending = false
  @state() phrases = Array(this.phraseLen).fill('')
  @state() seed = ''
  @state() pair: any = null

  get wrapName() {
    return this.name ? wrapTLD(this.name) : ''
  }
  get phraseValid() {
    return !this.phrases.some((r) => !r)
  }
  get restoreDisabled() {
    if (!this.name || !this.phraseValid || !this.pwd || !this.pwdconfirm) return true

    return Object.values(this.invalid).some((r) => r)
  }
  onInput = async (e: CustomEvent, idx: number) => {
    this.phrases[idx] = e.detail
    this.phrases = [...this.phrases]
  }
  onPaste = (e: ClipboardEvent) => {
    e.preventDefault()
    const text = (e.clipboardData || (window as any).clipboardData).getData('text')
    const phrases = text.split(' ')
    if (phrases.length === this.phraseLen) {
      this.phrases = phrases
    }
  }
  onInputName = (e: CustomEvent) => {
    // TODO: check valid
    const text = e.detail.trim()
    this.name = text
  }
  onInputPwd = (e: CustomEvent) => {
    const { error, msg } = chkPwdValid(e.detail)
    this.invalid = { ...this.invalid, pwd: msg ?? '' }
    this.pwd = e.detail
    if (error) return
    this.checkPwdEqual(e.detail, this.pwdconfirm)
  }
  onInputPwdConfirm = (e: CustomEvent) => {
    const { error, msg } = chkPwdValid(e.detail)
    this.invalid = { ...this.invalid, pwdconfirm: msg ?? '' }
    this.pwdconfirm = e.detail
    if (error) return
    this.checkPwdEqual(e.detail, this.pwd)
  }
  checkPwdEqual = (val: string, val2: string) => {
    this.invalid = { ...this.invalid, pwdconfirm: val === val2 ? '' : `Password don't match` }
  }

  restore = async () => {
    this.pair = await getKey(this.phrases.join(' '))
    console.table({ name: this.wrapName, pwd: this.pwd, seed: this.pair.seed })
  }

  submit() {}
  connectedCallback() {
    super.connectedCallback()
  }
  render() {
    return html`<div class="restore">
      <div class="dui-container">
        <div class="flex items-center">
          <dui-link back class="link"><i class="mdi mdi-arrow-left"></i>Back</dui-link>
        </div>
        <h1 class="my-4 text-4xl">Restore wallet</h1>
        <!-- doid name -->
        <p class="text-base mb-4">
          You are importing an address as Main Address for
          <dui-link class="link ml-0.5 underline">${this.wrapName}</dui-link>
        </p>
        <div>
          <dui-input-text @input=${this.onInputName} value=${this.name} placeholder="Enter DOID name" required>
            <span name="right">.doid</span>
            <span slot="label">DOID name</span>
          </dui-input-text>
        </div>
        <!-- phrase -->
        <h3 class="text-lg">Secret Recovery Phrase</h3>
        <div class="grid grid-cols-3 gap-4 m-4">
          ${repeat(
            this.phrases,
            (phrases: string, idx: number) => html`<div class="flex items-center gap-4">
              <b class="block w-10 shrink-0">${idx + 1}.</b>
              <dui-input-pwd
                .idx=${idx}
                dense
                ?autoforce=${idx === 0}
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
        <div class="mt-8">
          <dui-input-pwd
            .value=${this.pwd}
            .toggle=${this.toggle.pwd}
            required
            @input=${(e: CustomEvent) => this.onInputPwd(e)}
          >
            <span slot="label">New password</span>
            <span slot="msg">
              ${when(this.invalid.pwd, () => html`<span class="text-red-500">${this.invalid.pwd}</span>`)}
            </span></dui-input-pwd
          >
          <dui-input-pwd
            .value=${this.pwdconfirm}
            .toggle=${this.toggle.confirm}
            required
            @input=${this.onInputPwdConfirm}
            ><span slot="label">Confirm password</span
            ><span slot="msg">
              ${when(this.invalid.pwdconfirm, () => html`<span class="text-red-500">${this.invalid.pwdconfirm}</span>`)}
            </span></dui-input-pwd
          >
        </div>
        <div class="my-4">
          <dui-button class="secondary" block .disabled=${this.restoreDisabled} @click=${this.restore}
            >Restore</dui-button
          >
        </div>
      </div>
    </div>`
  }
}
