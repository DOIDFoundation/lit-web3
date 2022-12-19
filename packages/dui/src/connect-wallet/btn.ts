import { customElement, TailwindElement, html, state, when, property, classMap } from '../shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import emitter from '@lit-web3/core/src/emitter'
// Components
import './dialog'
import '../avatar'
import '../menu/drop'
import '../copy'

import style from './btn.css'
@customElement('connect-wallet-btn')
export class ConnectWalletBtn extends TailwindElement(style) {
  bindStore: any = new StateController(this, bridgeStore)
  @property({ type: Boolean }) dropable = false

  @state() dialog = false
  @state() menu = false

  get fullAddress() {
    return bridgeStore.bridge.account
  }
  get addr() {
    return bridgeStore.bridge.shortAccount
  }
  get scan() {
    return `${bridgeStore.bridge.network.current.scan}/address/${bridgeStore.bridge.account}`
  }

  show = () => {
    if (this.dropable && this.addr) {
      this.menu = !this.menu
    } else {
      this.dialog = true
    }
  }
  close() {
    this.dialog = false
  }

  connectedCallback(): void {
    emitter.on('connect-wallet', this.show)
    super.connectedCallback()
  }
  disconnectedCallback(): void {
    emitter.off('connect-wallet', this.show)
    super.disconnectedCallback()
  }

  override render() {
    return html`<div class="connect-wallet-btn relative">
      <dui-button sm @click=${this.show} class="inline-flex items-center">
        ${when(
          this.addr,
          () =>
            html`<dui-avatar class="mr-1"></dui-avatar>${this.addr}${when(
                this.dropable,
                () =>
                  html`<i
                    class="mdi mdi-chevron-down ml-1 ${classMap({
                      'mdi-chevron-down': !this.menu,
                      'mdi-chevron-up': this.menu
                    })}"
                  ></i>`
              )}`,
          () => html`Connect Wallet`
        )}
      </dui-button>
      <!-- Menu -->
      ${when(
        this.menu,
        () => html`<dui-drop show=${this.menu} @change=${(e: CustomEvent) => (this.menu = e.detail)}>
          <div class="flex w-full justify-between items-center py-3 pl-4 pr-2">
            <div class="flex items-center space-x-2">
              <dui-avatar></dui-avatar>
              <span>${this.addr}</span>
              <span>
                <dui-copy .value=${this.fullAddress} sm icon>
                  <span slot="copied" class="text-green-500">
                    <i class="mdi mdi-check-circle-outline "></i>
                  </span>
                  <span slot="copy"><i class="mdi mdi-content-copy"></i></span>
                </dui-copy>
                <dui-button sm icon href=${this.scan}><i class="mdi mdi-open-in-new"></i></dui-button
              ></span>
            </div>
            <div>
              <dui-button sm icon @click=${() => bridgeStore.bridge.disconnect()}
                ><i class="mdi mdi-link-variant-off"></i
              ></dui-button>
            </div>
          </div>
        </dui-drop>`
      )}
      <!-- Dialog -->
      ${when(this.dialog, () => html`<connect-wallet-dialog @close=${this.close}></connect-wallet-dialog>`)}
    </div>`
  }
}
