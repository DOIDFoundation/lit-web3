import { customElement, TailwindElement, html, property, when, unsafeHTML, classMap } from '../shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'

// Components
import './tx-view'

import style from './tx-state.css?inline'
@customElement('tx-state')
export class TxState extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Object }) tx: any
  @property({ type: Boolean }) txType = false
  @property({ type: Boolean, attribute: true }) inline = false
  @property({ type: Boolean }) onlyAwaitHash = false
  @property({ type: Object }) opts: any = {}

  get bridge() {
    return bridgeStore.bridge
  }
  get icons() {
    const [
      success = '<i class="mdi mdi-check-all"></i>',
      almostSuccess = '<i class="mdi mdi-check"></i>',
      failed = '<i class="mdi mdi-close"></i>',
      wait = '<i class="mdi mdi-loading"></i>'
    ] = this.opts.icons ?? []
    return { success, failed, wait, almostSuccess }
  }
  get hashOk() {
    return this.onlyAwaitHash && this.tx.hash
  }

  get state() {
    let [icon, txt, css] = ['', '', '']
    const { state } = this.opts
    switch (this.tx.status) {
      case -1:
        ;[icon, txt, css] = [this.icons.wait, state?.wait || `Waiting for confirmation` + '...', 'wait']
        break
      case 0:
        ;[icon, txt, css] = [this.icons.failed, this.tx.err?.message ?? `Something went wrong`, 'failed']
        break
      case 1:
        ;[icon, txt, css] = [this.icons.success, state?.success || `Success`, 'success']
        break
      case 2:
        ;[icon, txt] = [this.icons.wait, `Confirm the transaction...`]
        break
      case 4:
        ;[icon, txt, css] = [this.icons.almostSuccess, this.tx.err?.message || `Almost Success`, 'warn']
        break
    }
    if (this.hashOk) [icon, txt, css] = [this.icons.success, state?.success || `Success`, 'success']
    return { icon, txt, css }
  }

  get txScanUri() {
    const { hash } = this.tx
    if (!hash) return ''
    return `${this.bridge.network.current.scan}/tx/${hash}`
  }

  override render() {
    return html`<div
      class="tx-state ${classMap(this.$c([this.inline ? 'inline-flex flex-wrap' : 'flex flex-col m-4']))}"
    >
      <div class="tx-state-icon mx-auto ${classMap(this.$c([this.inline ? 'mr-2' : 'text-3xl my-3', this.state.css]))}">
        ${when(
          this.tx.pending && !this.hashOk,
          () => html`<slot name="pending">
            <i class="mdi mdi-loading"></i>
          </slot>`,
          () => html`<span>${unsafeHTML(this.state.icon)}</span>`
        )}
      </div>
      <div class="tx-state-msg grow ${classMap(this.$c([this.inline ? '' : 'my-4']))}">
        <slot>${this.state.txt}</slot>
      </div>
      <div class="flex gap-4">
        ${when(
          this.tx.hash,
          () =>
            html`${when(
              this.tx.success || this.tx.almostSuccess,
              () => html`<slot name="view"><tx-view .tx=${this.tx}></tx-view></slot>`,
              () => html`<tx-view .tx=${this.tx}></tx-view>`
            )}`
        )}
      </div>
    </div>`
  }
}
