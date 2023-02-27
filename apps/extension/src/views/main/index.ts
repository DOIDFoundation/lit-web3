import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { keyringStore, StateController } from '~/store/keyring'
import { keyringController } from '@/lib/keyringController'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'

import style from './main.css?inline'
@customElement('view-main')
export class ViewMain extends TailwindElement(style) {
  // bindStore: any = new StateController(this, keyringStore)
  @state() address = ''

  constructor() {
    super()
    keyringController.getAccounts().then((accounts: any[]) => {
      this.address = accounts.join(',')
    })
  }

  render() {
    return html`<div class="main">
      <div class="dui-container sparse">
        <div class="dui-container sparse">
          <doid-symbol class="block mt-12">
            <span slot="h1" class="text-xl">Your decentralized openid</span>
            <p slot="msg">Safer, faster and easier entrance to chains, contacts and dApps</p>
          </doid-symbol>
          <div class="max-w-xs mx-auto">
            <span slot="label">Address</span>
            <span slot="right" class="-mr-1">${this.address} </span>
          </div>
        </div>
      </div>
    </div>`
  }
}
