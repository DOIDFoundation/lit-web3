import { ThemeElement, html, customElement, when, state, keyed } from '@lit-web3/dui/shared/theme-element'
import { uiNetworks, StateController } from '~/store/networkState'
import { uiKeyring } from '~/store/keyringState'

// Components
import '@lit-web3/dui/input/text'
import '@lit-web3/dui/button'
import '@lit-web3/dui/address'
import '~/components/chain/list'
import '~/components/chain/accounts'

import style from './main.css?inline'
@customElement('view-main')
export class ViewMain extends ThemeElement(style) {
  bindKeyring: any = new StateController(this, uiKeyring)
  bindNetworks: any = new StateController(this, uiNetworks)

  get name() {
    return uiKeyring.selectedDOID?.name
  }
  get key() {
    const { name, id } = uiNetworks.currentNetwork ?? {}
    return [name, id, this.name].join('-')
  }

  connectedCallback() {
    super.connectedCallback()
  }
  render() {
    return html`<div class="main">
      <div class="w-full h-full flex items-stretch">
        <chain-list class="bg-gray-200 shrink"></chain-list>
        ${keyed(
          this.key,
          html`<account-list class="grow p-2 pl-3" .chain=${uiNetworks.currentBlockchain} .name=${this.name}
            >Addresses:</account-list
          >`
        )}
      </div>
    </div>`
  }
}
