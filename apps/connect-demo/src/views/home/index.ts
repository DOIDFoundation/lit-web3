import { TailwindElement, html, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { customElement } from 'lit/decorators.js'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
// Components
import { doidConnector } from '@doidfoundation/connect'
import '@lit-web3/dui/src/input/text'

@customElement('view-home')
export class ViewHome extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)

  get account() {
    return bridgeStore.account
  }

  render() {
    return html`
      <div class="dui-container my-8 mx-auto">
        <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect with modal dialog</h1>
        <dui-button sm @click=${doidConnector.connect}>
          <p>Connect Wallet</p>
        </dui-button>
        <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect without modal dialog</h1>
        <dui-button sm @click=${() => doidConnector.connect(false)}>
          <p>Connect Wallet</p>
        </dui-button>
        <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect with Web3Auth</h1>
        <dui-input-text
          id="web3authClientId"
          sm
          placeholder="Web3Auth ClientId"
          class="max-w-sm flex mb-2"
        ></dui-input-text>
        <dui-button
          sm
          @click=${() => doidConnector.updateOptions({ web3AuthClientId: this.$('#web3authClientId').value })}
          class="mr-2"
        >
          <p>Set Web3Auth ClientId</p>
        </dui-button>
        <dui-button sm @click=${() => doidConnector.connect()}>
          <p>Connect Wallet</p>
        </dui-button>
        <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect with WalletConnect</h1>
        <dui-input-text
          id="walletConnectId"
          sm
          placeholder="WalletConnect Project ID"
          class="max-w-sm flex mb-2"
        ></dui-input-text>
        <dui-button
          sm
          @click=${() => doidConnector.updateOptions({ walletConnectId: this.$('#walletConnectId').value })}
          class="mr-2"
        >
          <p>Set WalletConnect Project Id</p>
        </dui-button>
        <dui-button sm @click=${() => doidConnector.connect()}>
          <p>Connect Wallet</p>
        </dui-button>
      </div>
    `
  }
}
