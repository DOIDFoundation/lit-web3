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

import style from './chain.css?inline'
@customElement('chain-list')
export class ChainList extends TailwindElement(style) {
  bindNetworks = new StateController(this, uiNetworks)

  @property() class = ''
  @state() index = 0

  select = (chain: ChainNetwork) => {
    uiNetworks.selectChain(chain)
  }
  addChain = () => {}

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    if (!uiNetworks.inited) return ''
    return html`<div class="flex flex-col justify-center items-center ${classMap(this.$c([this.class]))}">
      ${repeat(
        uiNetworks.chainTabs,
        (chain: any) =>
          html`<div
            class="chain-tab ${classMap({ active: chain.symbol === uiNetworks.currentBlockchain?.symbol })}"
            @click=${() => this.select(chain)}
          >
            <div class="chain-icon inline-flex justify-center items-center ${chain?.symbol}"></div>
          </div>`
      )}

      <!-- <div
        class="m-2 w-10 h-10 rounded-full bg-gray-300 inline-flex justify-center items-center text-2xl text-white"
        @click=${this.addChain}
      >
        <i class="mdi mdi-plus"></i>
      </div> -->
    </div>`
  }
}
