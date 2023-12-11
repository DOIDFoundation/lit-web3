import { customElement, TailwindElement, html, state, when, property } from '@lit-web3/dui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import emitter from '@lit-web3/core/src/emitter'
import './dialog'

@customElement('connect-doid')
export class ConnectDOID extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: String }) appName = ''
  @state() dialog = false

  open = () => {
    this.dialog = true
  }
  close() {
    this.dialog = false
  }

  connectedCallback(): void {
    super.connectedCallback()
    emitter.on('connect-wallet', this.open)
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    emitter.off('connect-wallet', this.open)
  }

  override render() {
    return html`<div class="connect-wallet-btn relative">
      <!-- Dialog -->
      ${when(this.dialog, () => html`<connect-doid-dialog ?appName=${this.appName} @close=${this.close} />`)}
    </div>`
  }
}
