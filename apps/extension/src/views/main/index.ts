import { TailwindElement, html, customElement, when, state, keyed } from '@lit-web3/dui/src/shared/TailwindElement'
import { keyringStore, StateController } from '~/store/keyring'
import swGlobal from '~/ext.scripts/sw/swGlobal'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/address'
import '~/components/chain/list'
import '~/components/chain/accounts'
import { getAccount } from '~/lib.legacy/account'

import style from './main.css?inline'
@customElement('view-main')
export class ViewMain extends TailwindElement(style) {
  bindStore: any = new StateController(this, keyringStore)
  @state() address = ''
  @state() curChain = null as any

  get account() {
    return getAccount()
  }

  onSwitch(e: CustomEvent) {
    this.curChain = e.detail
  }

  connectedCallback() {
    swGlobal.controller?.keyringController.getAccounts().then((accounts: any[]) => {
      this.address = accounts.join(',')
    })
    super.connectedCallback()
  }
  render() {
    return html`<div class="main">
      ${when(
        this.address,
        () => html`<div class="flex gap-2">
          <span>ETH Address:</span>
          <dui-address .address=${this.address} copy></dui-address>
        </div>`
      )}
      <div class="w-full h-full flex items-stretch">
        <network-list class="bg-gray-200 shrink" @switch=${this.onSwitch}></network-list>
        ${keyed(
          this.curChain?.name,
          html`<account-list class="grow py-2 px-4" .chain=${this.curChain}>Addresses:</account-list>`
        )}
      </div>
    </div>`
  }
}
