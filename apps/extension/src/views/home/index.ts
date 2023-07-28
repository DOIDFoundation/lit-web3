import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { uiKeyring, StateController } from '~/store/keyringState'
import { accountStore } from '~/store/account'
import { bareTLD, wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'

import style from './home.css?inline'
import popupMessenger from '~/lib.next/messenger/popup'
@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  account: any = new StateController(this, accountStore)
  bindKeyring: any = new StateController(this, uiKeyring)
  @property() placeholder = 'e.g. satoshi.doid'
  @state() doid = ''
  @state() err = ''
  @state() showRegister = false
  @state() pending = false

  onInput = async (e: CustomEvent) => {
    this.err = ''
    this.showRegister = false
    this.doid = e.detail
  }
  register(e: CustomEvent) {
    e.preventDefault()
    goto(`/create/${this.doid}`)
  }

  async submit() {
    if (!this.doid) return
    this.pending = true
    const { DOIDs } = await popupMessenger.send('internal_getDOIDs')
    if (DOIDs && bareTLD(this.doid) in DOIDs) {
      this.err = 'Already imported'
      this.pending = false
      return
    }

    const { registered, available } = await accountStore.search(this.doid, true)
    if (registered) {
      goto('/start')
    } else if (available) {
      // goto(`/create/${wrapTLD(this.doid)}`)
      this.err = 'Available for registration'
      this.showRegister = true
    } else {
      if (this.doid.length < 6) this.err = 'Unavailable, name should be more than 6 characters'
      else this.err = 'Unavailable, this name is reserved'
    }
    this.pending = false
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
              autofocus
              @input=${this.onInput}
              @submit=${this.submit}
              value=${this.doid}
              placeholder=${this.placeholder}
              ?disabled=${this.pending}
            >
              <span slot="label"><slot name="label">Import or Create your DOID</slot></span>
              <span slot="msg">
                ${when(this.err, () => html`<span class="text-red-500">${this.err}</span>`)}
                ${when(this.showRegister, () => html`<dui-link @click=${this.register}>Register</dui-link>`)}</span
              >
              <span slot="right">
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
