import { TailwindElement, html, until, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { customElement } from 'lit/decorators.js'
// Components
import { DOIDConnector } from '@doidfoundation/connect'
import { DOIDConnectorEthers } from '@doidfoundation/connect-ethers'
import '@lit-web3/dui/src/input/text'

@customElement('view-home')
export class ViewHome extends TailwindElement('') {
  private doidConnector = new DOIDConnector(this)
  private doidConnectorEthers = new DOIDConnectorEthers(this)

  connectedCallback(): void {
    super.connectedCallback()
    this.updateComplete.then(() => this.doidConnector.connect())
  }

  get accountEthers(): Promise<string> {
    return this.doidConnectorEthers.signer.then((signer) => {
      return signer.address
    })
  }

  render() {
    return html`
      <div class="dui-container my-8 mx-auto flex flex-row-reverse space-x-2 space-x-reverse">
        <div class="flex-auto">
          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connection status</h1>
          <p>Is connected: ${this.doidConnector.connected}</p>
          ${when(
            this.doidConnector.connected,
            () => html`
              <p>Address: ${this.doidConnector.account}</p>
              <p>DOID: ${this.doidConnector.doid}</p>
            `
          )}

          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connection status(ethers)</h1>
          <p>Is connected: ${this.doidConnectorEthers.connected}</p>
          ${when(this.doidConnectorEthers.connected, () => html`Address: ${until(this.accountEthers)}`)}
        </div>
        <div class="flex-auto">
          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect with modal dialog</h1>
          <dui-button sm @click=${this.doidConnector.connect}>
            <p>Connect Wallet</p>
          </dui-button>

          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect without modal dialog</h1>
          <dui-button sm @click=${() => this.doidConnector.connect({ noModal: true })}>
            <p>Connect Wallet</p>
          </dui-button>

          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect using ethers</h1>
          <dui-button sm @click=${() => this.doidConnectorEthers.connect({ noModal: true })}>
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
            @click=${() => this.doidConnector.updateOptions({ web3AuthClientId: this.$('#web3authClientId').value })}
            class="mr-2"
          >
            <p>Set Web3Auth ClientId</p>
          </dui-button>
          <dui-button sm @click=${() => this.doidConnector.connect()}>
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
            @click=${() => this.doidConnector.updateOptions({ walletConnectId: this.$('#walletConnectId').value })}
            class="mr-2"
          >
            <p>Set WalletConnect Project Id</p>
          </dui-button>
          <dui-button sm @click=${() => this.doidConnector.connect()}>
            <p>Connect Wallet</p>
          </dui-button>
        </div>
      </div>
    `
  }
}
