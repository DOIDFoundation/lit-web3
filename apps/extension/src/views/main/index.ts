import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { keyringStore, StateController } from '~/store/keyring'
import { doidController } from '@/lib/keyringController'

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
    doidController.keyringController.getAccounts().then((accounts: any[]) => {
      this.address = accounts.join(',')
    })
  }

  render() {
    return html`<div class="main">
      <div class="dui-container sparse">
        <div class="dui-container sparse">
          <div class="max-w-xs mx-auto">
            <span slot="label">Address ETH</span>
            <span slot="right" class="-mr-1">${this.address}</span>
          </div>
        </div>
      </div>
    </div>`
  }
}
