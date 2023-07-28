import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  classMap,
  Ref,
  ref,
  createRef
} from '@lit-web3/dui/src/shared/TailwindElement'
import '@lit-web3/dui/src/input/pwd'
import { between } from '@lit-web3/dui/src/validator/string'

import style from './confirm.css?inline'

enum StoreKey {
  pwd = 'pwd',
  confirm = 'confirm'
}

@customElement('pwd-equal')
export class PwdEqual extends TailwindElement(style) {
  confirm$: Ref<HTMLInputElement> = createRef()
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
  change = (val: string, key: keyof typeof StoreKey = 'pwd') => {
    const { error, msg } = between(val)
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
  // confirm new password
  onConfirm = (e: CustomEvent) => {
    // @ts-expect-error
    this.confirm$.value?.el$?.value?.focus()
  }
  // submit password
  onSubmit = (e: CustomEvent) => {
    this.emit('submit', this.pwd)
  }

  connectedCallback() {
    super.connectedCallback()
  }
  render() {
    return html`<div class="my-4 ${classMap(this.$c([this.class]))}">
      <dui-input-pwd
        .value=${this.pwd}
        .toggle=${this.toggle.pwd}
        required
        @input=${this.onInput}
        autofocus
        @submit=${this.onConfirm}
      >
        <span slot="label">New password</span>
        <span slot="msg">
          ${when(this.pwdErr, () => html`<span class="text-red-500">${this.pwdErr}</span>`)}
        </span></dui-input-pwd
      >
      <dui-input-pwd
        ${ref(this.confirm$)}
        .value=${this.confirm}
        .toggle=${this.toggle.confirm}
        required
        @input=${this.onInputConfirm}
        @submit=${this.onSubmit}
        ><span slot="label">Confirm password</span
        ><span slot="msg">
          ${when(this.confirmErr, () => html`<span class="text-red-500">${this.confirmErr}</span>`)}
        </span></dui-input-pwd
      >
    </div>`
  }
}
