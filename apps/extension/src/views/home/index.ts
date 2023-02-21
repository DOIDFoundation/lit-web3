import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { keyringStore, StateController } from '~/store/keyring'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'

import style from './home.css?inline'
@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  bindStore: any = new StateController(this, keyringStore)
  @property() placeholder = 'e.g. satoshi.doid'
  @state() pwd = ''
  @state() err = ''
  @state() pending = false

  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    this.err = msg
    if (error) return
    this.pwd = val
  }

  submit() {}
  render() {
    return html`<div class="home">
      <div class="dui-container sparse">
        <div class="dui-container sparse">
          <doid-symbol class="block mt-12">
            <span slot="h1" class="text-xl">Your decentralized openid</span>
            <p slot="msg">Safer, faster and easier entrance to chains, contacts and dApps</p>
          </doid-symbol>
          <div class="max-w-xs mx-auto">
            <dui-input-text
              autoforce
              @input=${this.onInput}
              @submit=${this.submit}
              value=${this.pwd}
              placeholder=${this.placeholder}
              ?disabled=${this.pending}
            >
              <span slot="label"><slot name="label">Start with your desired DOID name</slot></span>
              <span slot="msg">
                ${when(
                  this.err,
                  () => html`<span class="text-red-500">${this.err}</span>`,
                  () => html`<slot name="msg"></slot>`
                )}
              </span>
              <span slot="right" class="-mr-1">
                <dui-button icon sm><i class="mdi mdi-arrow-right-bold-circle-outline text-xl"></i></dui-button>
              </span>
            </dui-input-text>
          </div>
        </div>
      </div>
    </div>`
  }
}
