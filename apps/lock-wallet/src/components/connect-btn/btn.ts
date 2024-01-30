import { customElement, ThemeElement, html, state, when, property } from '@lit-web3/dui/shared/theme-element'
import { bridgeStore, StateController } from '../../ethers/useBridge'
import emitter from '@lit-web3/base/emitter'
// Components
import '@lit-web3/dui/button'

import style from './btn.css?inline'
@customElement('connect-btn')
export class ConnectWalletBtn extends ThemeElement(style) {
  bindNetwork: any = new StateController(this, bridgeStore.bridge.network)
  bindBridge: any = new StateController(this, bridgeStore.bridge)
  get account() {
    return bridgeStore.bridge.account
  }
  get addr() {
    return bridgeStore.bridge?.shortAccount
  }
  get doid() {
    return bridgeStore.bridge.doid
  }
  get scan() {
    return `${bridgeStore.bridge?.network.current.scan}/address/${bridgeStore.bridge?.account}`
  }

  show = () => {
    console.log(123);

    if (this.doid) {
      // this.menu = !this.menu
    } else {
      bridgeStore.bridge.select(0)
    }
  }
  async connectedCallback() {
    super.connectedCallback()
    emitter.on('connect-wallet', this.show)
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    emitter.off('connect-wallet', this.show)
  }
  render() {
    if (this.account)
      return html`
      <div class="rounded-lg border p-2 px-4 font-bold bg-gray-100">
        ${when(this.doid, () => html`${this.doid}`, () => html`${this.addr}`)}
      </div>

    `
    else
      return html`
        <dui-button sm @click=${() => this.show()} theme="dark">Connect Wallet</dui-button>
      `
  }
}
