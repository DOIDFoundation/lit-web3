import {
  TailwindElement,
  html,
  customElement,
  state,
  property,
  repeat,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import { uiNetworks, StateController } from '~/store/networkState'
// Components
import '@lit-web3/dui/src/menu/drop'
import '@lit-web3/dui/src/chain/symbol'

import style from './chain.css?inline'
@customElement('chain-switch')
export class ChainSwitch extends TailwindElement(style) {
  bindNetworks = new StateController(this, uiNetworks)

  @property() chain!: ChainNetwork
  @state() menu = false

  switch = async (network: ChainNetwork) => {
    await uiNetworks.switchNetwork(network.name, network.id)
  }

  async connectedCallback() {
    super.connectedCallback()
  }

  render() {
    if (!uiNetworks.inited) return ''
    return html`<dui-drop
      .show=${this.menu}
      @change=${(e: CustomEvent) => (this.menu = e.detail)}
      btnText
      btnSm
      btnDense
      icon
      dropClass="w-56"
      btnClass="!text-inherit !text-xs"
    >
      <span title=${uiNetworks.currentNetwork?.title} class="inline-flex items-center gap-1" slot="button"
        ><chain-symbol .chain=${uiNetworks.currentNetwork}></chain-symbol>${uiNetworks.currentNetwork?.abbr}</span
      >
      <!-- Content -->
      <ul class="dui-option">
        ${repeat(
          uiNetworks.currentNetworks,
          (network) =>
            html`<li
              @click=${() => this.switch(network)}
              class="${classMap({ active: network.id === uiNetworks.currentNetwork?.id })}"
            >
              <chain-symbol .chain=${network}></chain-symbol>
              ${network.title}
            </li>`
        )}
      </ul>
    </dui-drop>`
  }
}
