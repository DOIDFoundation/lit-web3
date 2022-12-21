import { PropertyValues } from 'lit'
import { customElement, TailwindElement, html, classMap, state } from '../shared/TailwindElement'
import { bridgeStore, StateController, getBlockNumber } from '@lit-web3/ethers/src/useBridge'
import { sleep } from '@lit-web3/ethers/src/utils'

import style from './blockNumber.css?inline'

@customElement('block-number')
export class BlockNumber extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() pending = false

  get provider() {
    return bridgeStore.bridge.provider
  }
  get err() {
    return this.provider.connecting || !this.provider.blockNumber
  }
  get blockNumber() {
    return bridgeStore.blockNumber
  }
  async motion() {
    this.pending = true
    await sleep(1300)
    this.pending = false
  }

  willUpdate(changed: PropertyValues<this>) {
    if (changed.has('pending')) return
    this.motion()
  }

  override render() {
    getBlockNumber()
    if (bridgeStore.blockNumber <= 0) return html``
    return html`
      <span
        class="blockNumber inline-flex items-center align-middle ${classMap({ pending: this.pending, err: this.err })}"
      >
        <span class="blockStat flex relative justify-center items-center">
          <i class="dot block"></i>
          <i class="mdi mdi-loading absolute pending"></i>
        </span>
        <a href=${`${bridgeStore.bridge.network.current.scan}/block/${this.blockNumber}`} target="_blank" rel="noopener"
          >${this.blockNumber}</a
        >
      </span>
    `
  }
}
