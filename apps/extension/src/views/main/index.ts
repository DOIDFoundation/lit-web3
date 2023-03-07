import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { keyringStore, StateController } from '@/store/keyring'
import swGlobal from '~/ext.scripts/sw/swGlobal'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/address'
import { getAccount } from '@/lib/account'

import style from './main.css?inline'
@customElement('view-main')
export class ViewMain extends TailwindElement(style) {
  bindStore: any = new StateController(this, keyringStore)
  @state() address = ''

  get account() {
    return getAccount()
  }

  connectedCallback() {
    swGlobal.controller?.keyringController.getAccounts().then((accounts: any[]) => {
      this.address = accounts.join(',')
    })
    super.connectedCallback()
  }

  render() {
    return html`<div class="main -mt-6">
      <div class="dui-container">
        <div class="py-2 flex justify-between items-center border-b">
          <div></div>
          <div class="flex flex-col items-center">
            <span class="text-lg">${this.account.name}</span>
            <dui-address class="text-xs text-gray-500" .address=${this.account.mainAddress}></dui-address>
          </div>
          <div>
            <i class="text-2xl mdi mdi-dots-vertical"></i>
          </div>
        </div>
        ${when(
          this.address,
          () => html`<div class="flex gap-2">
            <span>ETH Address:</span>
            <dui-address .address=${this.address} copy></dui-address>
          </div>`
        )}
        <div></div>
      </div>
    </div>`
  }
}
