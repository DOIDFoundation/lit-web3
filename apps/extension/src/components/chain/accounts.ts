import { ThemeElement, html, customElement, property, state, classMap } from '@lit-web3/dui/shared/theme-element'
import { uiNetworks, StateController } from '~/store/networkState'
import { uiKeyring } from '~/store/keyringState'
// Components
import '@lit-web3/dui/address'
import './switch'

@customElement('account-list')
export class accountList extends ThemeElement(null) {
  bindKeyring: any = new StateController(this, uiKeyring)
  bindNetworks: any = new StateController(this, uiNetworks)

  @property() chain!: ChainNetwork
  @property() class = ''

  get mainAddress() {
    return uiKeyring.addresses[this.chain.name]
  }
  async connectedCallback() {
    super.connectedCallback()
  }

  render() {
    if (!this.chain) return ''
    return html`<div class="flex flex-col justify-start items-start ${classMap(this.$c([this.class]))}">
      <div class="mb-4 w-full flex justify-between items-center">
        <strong>${this.chain.title}</strong>
        <chain-switch .chain=${this.chain}></chain-switch>
      </div>
      <p class="text-xs text-gray-500 mb-1">Main address:</p>
      <dui-address .address=${this.mainAddress} copy></dui-address>
      <!-- <p class="text-xs text-gray-500 mt-4 mb-1">Other addresses:</p> -->
    </div>`
  }
}
