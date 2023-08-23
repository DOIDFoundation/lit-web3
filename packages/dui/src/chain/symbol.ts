import { TailwindElement, html, customElement, state, property, styleMap } from '../shared/TailwindElement'
import { getSymbol } from '@lit-web3/chain/src/symbol'

import style from './symbol.css?inline'
@customElement('chain-symbol')
export class ChainSymbol extends TailwindElement(style) {
  @property() chain?: ChainNetwork
  @property() symbol = ''

  @state() _symbol = ''

  get icon() {
    return this.symbol ? this.symbol : this._symbol
  }

  get isTestnet() {
    return this.chain?.testnet
  }

  async connectedCallback() {
    super.connectedCallback()
    if (this.chain) this._symbol = await getSymbol(this.chain)
  }

  render() {
    if (!this.chain) return ''
    if (this.isTestnet) return html`<i class="chain-symbol testnet" icon=${this.icon}></i>`
    return html`<i class="chain-symbol" style=${styleMap({ backgroundImage: `url(${this.icon})` })}></i>`
  }
}
