import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'

import style from './phrase.css?inline'
@customElement('view-create-pwd')
export class ViewPwd extends TailwindElement(style) {
  @property() placeholder = 'Password'
  @property() PASSWORD_MIN_LENGTH = 8
  @state() pwd = '123qwe123'
  @state() confirmPwd = ''
  @state() err = ''
  @state() pending = false
  @state() btnDisabled = true
  @state() isUnderstand = true

  isValid = () => {
    if (!this.pwd || !this.confirmPwd || this.pwd !== this.confirmPwd || !this.isUnderstand) {
      // this.btnDisabled = true
      return true
    }
    if (this.pwd.length < this.PASSWORD_MIN_LENGTH) {
      // this.btnDisabled = true
      return true
    }
    return false
  }
  onInput = async (e: CustomEvent) => {
    // const { error = '', msg = '' } = {}
    this.pwd = e.detail
    this.btnDisabled = this.isValid()
  }
  onConfirmInput = async (e: CustomEvent) => {
    this.confirmPwd = e.detail
    this.btnDisabled = this.isValid()
  }
  onInputCheckbox = async (e: CustomEvent) => {
    this.isUnderstand = !this.isUnderstand
    this.btnDisabled = this.isValid()
  }
  routeGoto = async (step: string) => {
    this.emit('routeGoto', { step, pwd: this.pwd })
  }
  submit() {}
  render() {
    return html` <div class="dui-container">
      <div class="text-lg font-bold mt-2 text-center">Create password</div>
      <div class="mt-2 text-center">
        This password will unlock your DOID name(s) only on this device. DOID can not recover this password.
      </div>
      <div class="mt-6">
        <dui-input-text
          autofocus
          type="password"
          @input=${this.onInput}
          @submit=${this.submit}
          value=${this.pwd}
          placeholder=${this.placeholder}
          ?disabled=${this.pending}
        >
          <span class="text-gray-500" slot="label"> New password(8 characters min) </span>
          <span slot="msg">
            ${when(
              this.err,
              () => html`<span class="text-red-500">${this.err}</span>`,
              () => html`<slot name="msg"></slot>`
            )}
          </span>
        </dui-input-text>
      </div>
      <div class="">
        <dui-input-text
          autofocus
          type="password"
          @input=${this.onConfirmInput}
          @submit=${this.submit}
          value=${this.confirmPwd}
          placeholder=${this.placeholder}
          ?disabled=${this.pending}
        >
          <span class="text-gray-500" slot="label"> Confirm password </span>
          <span slot="msg">
            ${when(
              this.err,
              () => html`<span class="text-red-500">${this.err}</span>`,
              () => html`<slot name="msg"></slot>`
            )}
          </span>
        </dui-input-text>
      </div>
      <div>
        <label>
          <input type="checkbox" .checked="${this.isUnderstand}" @change="${this.onInputCheckbox}" />
          I understand that DOID cannot recover this password for me.
        </label>
      </div>
      <div class="mt-4 flex justify-between">
        <div></div>

        <dui-button
          ?disabled=${this.btnDisabled}
          @click=${() => this.routeGoto('2')}
          class="secondary !rounded-full h-12 w-12"
          ><i class="mdi mdi-arrow-right"></i
        ></dui-button>
      </div>
    </div>`
  }
}
