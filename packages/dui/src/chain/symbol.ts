import { TailwindElement, html, customElement, state, property, styleMap, when } from '../shared/TailwindElement'
import { getSymbol } from '@lit-web3/chain/src/symbol'

import style from './symbol.css?inline'
@customElement('chain-symbol')
export class ChainSymbol extends TailwindElement(style) {
  @property() chain?: ChainNetwork
  @property() symbol = ''
  @property({ type: Boolean }) text = false

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
    return html`<!-- Icon -->
      ${when(
        this.isTestnet,
        () => html`<i class="chain-symbol testnet" icon=${this.icon}></i>`,
        () => html`<i class="chain-symbol" style=${styleMap({ backgroundImage: `url(${this.icon})` })}></i>`
      )}
      <!-- Title -->
      ${when(this.text, () => html`${this.chain?.title}`)}`
  }
}
