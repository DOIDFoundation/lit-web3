import { customElement, TailwindElement, html, state, when, property, classMap } from '../shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import emitter from '@lit-web3/core/src/emitter'
// Components
import './dialog'
import '../address'
import '../menu/drop'
import '../copy/icon'

import style from './btn.css?inline'
@customElement('connect-wallet-btn')
export class ConnectWalletBtn extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Boolean }) dropable = false

  @state() dialog = false
  @state() menu = false

  get account() {
    return bridgeStore.account
  }
  get addr() {
    return bridgeStore.bridge?.shortAccount
  }
  get scan() {
    return `${bridgeStore.bridge?.network.current.scan}/address/${bridgeStore.bridge?.account}`
  }

  show = () => {
    if (this.dropable && this.account) {
      this.menu = !this.menu
    } else {
      this.dialog = true
    }
  }
  close() {
    this.dialog = false
  }

  connectedCallback(): void {
    super.connectedCallback()
    emitter.on('connect-wallet', this.show)
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    emitter.off('connect-wallet', this.show)
  }

  render() {
    // Dropdown Button
    if (this.account)
      return html`<dui-drop
        .show=${this.menu}
        @change=${(e: CustomEvent) => (this.menu = e.detail)}
        ?icon=${this.dropable}
        btnSm
        btnTheme="dark"
      >
        <dui-address slot="button" avatar short></dui-address>
        <!-- Content -->
        <div class="flex w-full justify-between items-center py-3 pl-4 pr-2">
          <div class="flex items-center space-x-2">
            <dui-address-avatar></dui-address-avatar>
            <span>${this.addr}</span>
            <span>
              <dui-copy-icon .value=${this.account}></dui-copy-icon>
              <dui-button sm icon href=${this.scan}><i class="mdi mdi-open-in-new"></i></dui-button
            ></span>
          </div>
          <div>
            <dui-button sm icon @click=${() => bridgeStore.bridge.disconnect()}
              ><i class="mdi mdi-link-variant-off"></i
            ></dui-button>
          </div>
        </div>
        <slot name="submenu"></slot>
      </dui-drop>`
    // Dialog Button
    else
      return html`
        <dui-button sm @click=${() => (this.dialog = true)} theme="dark">Connect Wallet</dui-button>
        <!-- Dialog -->
        ${when(this.dialog, () => html`<connect-wallet-dialog @close=${this.close}></connect-wallet-dialog>`)}
      `
  }
}
