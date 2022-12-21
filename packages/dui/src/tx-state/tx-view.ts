import { customElement, TailwindElement, html, property } from '../shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { shortAddress } from '@lit-web3/ethers/src/utils'
// Components
import '../link'

import style from './tx-view.css?inline'
@customElement('tx-view')
export class TxView extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Object }) tx: any

  get bridge() {
    return bridgeStore.bridge
  }

  get txScanUri() {
    const { hash } = this.tx
    if (!hash) return ''
    return `${this.bridge.network.current.scan}/tx/${hash}`
  }

  override render() {
    return html`<dui-link class="uri mt-4" href="${this.txScanUri}" target="_blank" rel="noopener"
      >View Transaction: ${shortAddress(this.tx.hash)}</dui-link
    >`
  }
}
