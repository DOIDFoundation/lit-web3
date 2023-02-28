import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { keyringStore, StateController } from '~/store/keyring'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'

import style from './create.css?inline'
@customElement('view-create')
export class ViewHome extends TailwindElement(style) {
  bindStore: any = new StateController(this, keyringStore)
  @property() doid = ''

  goto() {
    goto(`/restore/${this.doid}`)
  }

  render() {
    return html`<div class="create">
      <div class="dui-container sparse">
        <div class="dui-container sparse">
          <doid-symbol class="block mt-12">
            <span slot="h1" class="text-xl">Your decentralized openid</span>
            <p slot="msg">Safer, faster and easier entrance to chains, contacts and dApps</p>
          </doid-symbol>
          <div class="max-w-xs mx-auto">
            <span slot="label"><slot name="label">${this.doid}</slot></span>
            <span slot="msg" class="ml-1"><slot name="msg">is available</slot></span>
          </div>
          <div class="max-w-xs mx-auto my-2">
            <dui-button class="secondary" block href="https://app.doid.tech/search/${this.doid}"
              >Create with an Ethereum wallet</dui-button
            >
          </div>
          <div class="max-w-xs mx-auto my-2">
            <dui-button class="secondary" @click=${this.goto} block>Create in DOID for chrome</dui-button>
          </div>
        </div>
      </div>
    </div>`
  }
}
