import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import '@lit-web3/dui/src/input/pwd'
import { chkPwdValid } from '@/lib/utils'

import style from './confirm.css?inline'

@customElement('pwd-equal')
export class PwdEqual extends TailwindElement(style) {
  @property({ type: String }) class = ''
  @state() pwd = ''
  @state() confirm = ''
  @state() toggle = { pwd: true, confirm: true }
  @state() pwdErr = ''
  @state() confirmErr = ''

  get error() {
    return this.pwdErr || this.confirmErr
  }

  checkPwdEqual = (val: string, val2: string) => {
    this.confirmErr = val === val2 ? '' : `Password don't match`
  }
  change = (val: string, key = 'pwd') => {
    const { error, msg } = chkPwdValid(val)
    this[key] = val
    this[`${key}Err`] = error ? msg : ''

    if (!error) this.checkPwdEqual(val, key === 'pwd' ? this.confirm : this.pwd)
    this.emit('change', {
      error: this.error,
      pwd: !this.error ? this.pwd : ''
    })
  }
  onInput = (e: CustomEvent) => {
    this.change(e.detail)
  }
  onInputConfirm = (e: CustomEvent) => {
    this.change(e.detail, 'confirm')
  }

  connectedCallback() {
    super.connectedCallback()
  }
  render() {
    return html`<div class="my-4 ${classMap(this.$c([this.class]))}">
      <dui-input-pwd .value=${this.pwd} .toggle=${this.toggle.pwd} required @input=${this.onInput}>
        <span slot="label">New password</span>
        <span slot="msg">
          ${when(this.pwdErr, () => html`<span class="text-red-500">${this.pwdErr}</span>`)}
        </span></dui-input-pwd
      >
      <dui-input-pwd .value=${this.confirm} .toggle=${this.toggle.confirm} required @input=${this.onInputConfirm}
        ><span slot="label">Confirm password</span
        ><span slot="msg">
          ${when(this.confirmErr, () => html`<span class="text-red-500">${this.confirmErr}</span>`)}
        </span></dui-input-pwd
      >
    </div>`
  }
}
