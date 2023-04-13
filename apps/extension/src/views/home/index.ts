import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { keyringStore, StateController } from '~/store/keyring'
import { accountStore } from '~/store/account'
import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'

import style from './home.css?inline'
@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  account: any = new StateController(this, accountStore)
  bindStore: any = new StateController(this, keyringStore)
  @property() placeholder = 'e.g. satoshi.doid'
  @state() doid = ''
  @state() err = ''
  @state() pending = false

  onInput = async (e: CustomEvent) => {
    this.err = ''
    this.doid = e.detail
  }

  async submit() {
    if (!this.doid) return
    this.pending = true
    const { registered, available } = await accountStore.search(this.doid, true)
    if (registered) {
      goto('/start')
    } else if (available) {
      goto(`/create/${wrapTLD(this.doid)}`)
    } else {
      this.err = 'Unavailable'
      this.pending = false
    }
  }

  render() {
    return html`<div class="home">
      <div class="dui-container sparse">
        <div class="dui-container sparse">
          <doid-symbol class="block mt-16">
            <span slot="h1" class="text-xl">Your decentralized openid</span>
            <p slot="msg">Safer, faster and easier entrance to chains, contacts and dApps</p>
          </doid-symbol>
          <div class="max-w-xs mx-auto">
            <dui-input-text
              autoforce
              @input=${this.onInput}
              @submit=${this.submit}
              value=${this.doid}
              placeholder=${this.placeholder}
              ?disabled=${this.pending}
            >
              <span slot="label"><slot name="label">Start with your desired DOID name</slot></span>
              <span slot="msg"> ${when(this.err, () => html`<span class="text-red-500">${this.err}</span>`)} </span>
              <span slot="right" class="-mr-1">
                ${when(
                  this.pending,
                  () => html`<i class="mdi mdi-loading text-xl"></i>`,
                  () => html`<dui-button @click=${this.submit} icon sm
                    ><i class="mdi mdi-arrow-right-bold-circle-outline text-xl"></i
                  ></dui-button>`
                )}
              </span>
            </dui-input-text>
          </div>
        </div>
      </div>
    </div>`
  }
}
