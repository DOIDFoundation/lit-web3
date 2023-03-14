import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/input/pwd'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'

import style from './unlock.css?inline'
import { StateController, walletStore } from '~/store'
import { goto } from '@lit-web3/dui/src/shared/router'
@customElement('view-unlock')
export class ViewUnlock extends TailwindElement(style) {
  state = new StateController(this, walletStore)
  @property() ROUTE?: any
  @property() placeholder = 'Password'
  @state() pwd = ''
  @state() err = ''
  @state() pending = false
  @state() disabled = true

  onInput = async (e: CustomEvent) => {
    // const { val = '', error = '', msg = '' } = {}
    // this.err = msg
    // if (error) return
    // this.pwd = val
    this.pwd = e.detail
    this.disabled = !Boolean(this.pwd)
  }

  submitPwd = async () => {
    try {
      if (location.pathname.includes('generate-phrase')) {
        this.emit('routeGoto', { path: 'generate-addresses', pwd: this.pwd })
        return
      }
      await walletStore.executeBackgroundAction('submitPassword', this.pwd)
      goto(`/main`)
    } catch (error: any) {
      console.log(error.message, 'error')
      this.err = error.message ?? error
    }
  }
  render() {
    return html`<div class="unlock">
      <div class="dui-container">
        <div class="dui-container">
          <doid-symbol class="block mt-24">
            <span slot="h1" class="text-xl">Welcom back!</span>
            <p slot="msg">Your decentralized openid</p>
          </doid-symbol>
          <div class="max-w-xs mx-auto">
            <dui-input-pwd
              autoforce
              type="password"
              @input=${this.onInput}
              value=${this.pwd}
              placeholder=${this.placeholder}
              ?disabled=${this.pending}
            >
              <span slot="label"><slot name="label"></slot></span>
              <span slot="msg">
                ${when(
                  this.err,
                  () => html`<span class="text-red-500">${this.err}</span>`,
                  () => html`<slot name="msg"></slot>`
                )}
              </span>
            </dui-input-pwd>
            <div class="my-2">
              <dui-button
                class="block w-full secondary !rounded-full h-12"
                @click=${this.submitPwd}
                ?disabled=${this.disabled}
                block
                >Unlock</dui-button
              >
            </div>
            <p class="text-center my-4 text-xs"><dui-link href="/restore" class="link">Forgot?</dui-link></p>
          </div>
        </div>
      </div>
    </div>`
  }
}
