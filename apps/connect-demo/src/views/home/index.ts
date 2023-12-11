import { TailwindElement, html, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { customElement, query } from 'lit/decorators.js'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
// Components
import '@doidfoundation/connect'
import { ConnectDOID } from '@doidfoundation/connect'

@customElement('view-home')
export class ViewHome extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)

  @query('connect-doid') connector: ConnectDOID | undefined

  get account() {
    return bridgeStore.account
  }

  render() {
    return html`<connect-doid></connect-doid>
      <div class="ui-container my-8 text-center">
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
      </div>`
  }
}
