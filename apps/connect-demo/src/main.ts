import AppRoot from '@lit-web3/dui/src/shared/AppRoot.ethers'
import { routes } from '~/router'
import { TailwindElement, html, customElement, when, query } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/nav/footer'
import '@doidfoundation/connect'
import { StateController, bridgeStore } from '@lit-web3/ethers/src/useBridge'
import { ConnectDOID } from '@doidfoundation/connect'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)

  @query('connect-doid') connector: ConnectDOID | undefined

  get account() {
    return bridgeStore.account
  }

  render() {
    return html`
      <connect-doid></connect-doid>
      <dui-header>
        <p slot="center" class="font-bold">Wallet Demo</p>
        ${when(
          this.account,
          () => html`${this.account}`,
          () =>
            html`<dui-button
              slot="wallet"
              sm
              @click=${() => {
                this.connector?.open()
              }}
            >
              <p>Connect Wallet</p>
            </dui-button>`
        )}
      </dui-header>
      <main class="dui-app-main">
        <slot></slot>
      </main>
      <dui-footer></dui-footer>
    `
  }
}

AppRoot({ routes })
