import { TailwindElement, createRef, html, ref, until, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { customElement } from 'lit/decorators.js'
// Components
import icon from '@lit-web3/dui/src/i/doid.svg'
import '@doid/connect'
import { DOIDConnectButton, DOIDConnector } from '@doid/connect'
import { DOIDConnectorEthers } from '@doid/connect-ethers'
import '@lit-web3/dui/src/input/text'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { WalletState, emitWalletChange } from '@lit-web3/ethers/src/wallet'

@customElement('view-home')
export class ViewHome extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  private connectButtonRef = createRef<DOIDConnectButton>()
  private doidConnector = new DOIDConnector(this)
  private doidConnectorEthers = new DOIDConnectorEthers(this)

  connectedCallback(): void {
    super.connectedCallback()
    this.updateComplete.then(() => this.doidConnector.connect())

    const connector = this.doidConnectorEthers
    let wallet: Wallet = {
      state: WalletState,
      get accounts() {
        return [this.account]
      },
      get account() {
        return connector.account as string
      },
      updateProvider(chainId: string) {
        connector.getWalletClient().then((client) => client.switchChain({ id: Number(chainId) }))
      },
      async connect() {
        this.state = WalletState.CONNECTING
        return connector
          .connect()
          .then(() => (this.state = WalletState.CONNECTED))
          .catch(() => (this.state = WalletState.DISCONNECTED))
      },
      async disconnect() {
        await connector.disconnect()
        this.state = WalletState.DISCONNECTED
        emitWalletChange()
      },
      install: () => {}
    }
    bridgeStore.bridge.wallets.push({
      name: 'DOID',
      title: 'DOID',
      icon: icon,
      app: wallet,
      import: async () => {}
    })
  }

  get accountEthers(): Promise<string> {
    return this.doidConnectorEthers.signer.then((signer) => {
      return signer.address
    })
  }

  connectEthers() {
    return bridgeStore.bridge.select(bridgeStore.bridge.wallets.findIndex((wallet) => wallet.name == 'DOID'))
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
              <dui-button sm @click=${() => this.doidConnector.disconnect()}>Disconnect</dui-button>
            `
          )}

          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connection status(ethers)</h1>
          <p>Is connected: ${this.doidConnectorEthers.connected}</p>
          ${when(this.doidConnectorEthers.connected, () => html`Address: ${until(this.accountEthers)}`)}
        </div>
        <div class="flex-auto">
          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect with DOID connect button</h1>
          <doid-connect-button ${ref(this.connectButtonRef)} appName="Demo App"></doid-connect-button>
          <dui-button
            sm
            class="ml-2"
            @click=${() => {
              this.connectButtonRef.value?.requestUpdate()
              this.doidConnector.updateOptions({ themeMode: 'light' })
            }}
            >Theme light</dui-button
          >
          <dui-button
            sm
            class="ml-2"
            @click=${() => {
              this.connectButtonRef.value?.requestUpdate()
              this.doidConnector.updateOptions({ themeMode: 'dark' })
            }}
            >Theme dark</dui-button
          >

          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect with modal dialog</h1>
          <dui-button sm @click=${this.doidConnector.connect}>
            <p>Connect Wallet</p>
          </dui-button>

          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect without modal dialog</h1>
          <dui-button sm @click=${() => this.doidConnector.connect({ noModal: true })}>
            <p>Connect Wallet</p>
          </dui-button>

          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect using ethers</h1>
          <dui-button sm @click=${() => this.connectEthers()}>
            <p>Connect Wallet</p>
          </dui-button>

          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect with Web3Auth</h1>
          <dui-button sm class="mr-2" @click=${() => this.doidConnector.updateOptions({ web3AuthEnabled: true })}>
            <p>Enable Web3Auth</p>
          </dui-button>
          <dui-button
            sm
            class="mr-2"
            @click=${() => this.doidConnector.updateOptions({ web3AuthNetwork: 'sapphire_mainnet' })}
          >
            <p>Switch to Web3Auth Mainnet</p>
          </dui-button>
          <dui-button sm @click=${() => this.doidConnector.connect()}>
            <p>Connect Wallet</p>
          </dui-button>
          <dui-input-text
            id="web3authClientId"
            value="BFLXJsHIHv_CgxalXixrZlytDYyf47hk64XDMXOj4vNVIGGJ9HMOyhvIbYmw3dWcwxaqadObQQSwFjR51FJvgVg"
            placeholder="Web3Auth ClientId"
            class="max-w-sm flex my-1"
            ><p slot="msg">
              Use your own id when developing or submit an issue on github to allow your domain.
            </p></dui-input-text
          >
          <dui-button
            sm
            @click=${() => this.doidConnector.updateOptions({ web3AuthClientId: this.$('#web3authClientId').value })}
          >
            <p>Set Web3Auth ClientId</p>
          </dui-button>
          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect with WalletConnect</h1>
          <dui-button sm class="mr-2" @click=${() => this.doidConnector.updateOptions({ walletConnectEnabled: true })}>
            <p>Enable WalletConnect</p>
          </dui-button>
          <dui-button sm @click=${() => this.doidConnector.connect()}>
            <p>Connect Wallet</p>
          </dui-button>
          <dui-input-text
            id="walletConnectId"
            value="f58e1488ccb9f5b7ef6f11ffa1cd8ba1"
            placeholder="WalletConnect Project ID"
            class="max-w-sm flex my-2"
            ><p slot="msg">This default ID can only be used on doid.tech</p></dui-input-text
          >
          <dui-button
            sm
            @click=${() => this.doidConnector.updateOptions({ walletConnectId: this.$('#walletConnectId').value })}
          >
            <p>Set WalletConnect Project Id</p>
          </dui-button>
        </div>
      </div>
    `
  }
}
