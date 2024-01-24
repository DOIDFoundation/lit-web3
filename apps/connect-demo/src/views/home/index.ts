import { ThemeElement, createRef, html, ref, until, when } from '@lit-web3/dui/shared/theme-element'
import { customElement, state } from 'lit/decorators.js'
// Components
import '@doid/connect'
import {
  Chain,
  doid,
  DOIDConnectButton,
  DOIDConnector,
  doidTestnet,
  fantomTestnet,
  options,
  WalletClient
} from '@doid/connect'
import { DOIDConnectorEthers } from '@doid/connect-ethers'
import '@lit-web3/dui/input/text'
import '@lit-web3/dui/button'
import '@lit-web3/dui/menu/drop'

@customElement('view-home')
export class ViewHome extends ThemeElement('') {
  private connectButtonRef = createRef<DOIDConnectButton>()
  private doidConnector = new DOIDConnector(this)
  private doidConnectorEthers = new DOIDConnectorEthers(this)
  @state() private walletClient?: WalletClient
  @state() private accountEthers?: string
  @state() private doidNetwork?: Chain
  @state() private doidNetworkMenu?: boolean
  @state() private doidResult?: string
  @state() private ensResult?: string

  private walletClientUpdater: any
  connectedCallback(): void {
    super.connectedCallback()
    const updateWalletClient = () => {
      if (!this.walletClientUpdater) {
        this.walletClientUpdater = this.doidConnector
          .getWalletClient()
          .then((walletClient) => (this.walletClient = walletClient))
          .catch((e) => console.warn('Got error:', e))
          .finally(() => (this.walletClientUpdater = undefined))
      }
    }
    this.doidConnector.subscribe(updateWalletClient, ['account', 'chainId'])
    updateWalletClient()
    this.doidNetwork = options.doidNetwork
  }

  async connectEthers() {
    let signer = await this.doidConnectorEthers.getSigner()
    this.accountEthers = signer.address
  }

  switchNetwork(network: Chain) {
    this.doidNetworkMenu = false
    switch (network.id) {
      case doid.id:
        this.doidConnector.updateOptions({ doidNetwork: doid })
        break
      case doidTestnet.id:
        this.doidConnector.updateOptions({ doidNetwork: doidTestnet })
        break
      case fantomTestnet.id:
        this.doidConnector.updateOptions({ doidNetwork: fantomTestnet })
        break
    }
    this.doidNetwork = network
  }

  async getDOID(address: string) {
    this.doidResult = (await this.doidConnectorEthers.getDOID(address)) ?? 'not found'
    this.ensResult = (await this.doidConnectorEthers.getProvider(doidTestnet.id).lookupAddress(address)) ?? 'not found'
  }

  render() {
    return html`
      <div class="dui-container my-8 mx-auto flex flex-row-reverse space-x-2 space-x-reverse">
        <div class="flex-auto max-w-lg">
          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">WalletClient status</h1>
          <p>Account:</p>
          <div class="whitespace-pre overflow-auto border font-mono text-xs max-h-12">
            ${JSON.stringify(this.walletClient?.account, undefined, 1)}
          </div>
          <p>Chain:</p>
          <div class="whitespace-pre overflow-auto border font-mono text-xs max-h-20">
            ${JSON.stringify(this.walletClient?.chain, undefined, 1)}
          </div>
          <p>ChainId: <code>${until(this.walletClient?.getChainId())}</code></p>
          <p>Connected addresses:</p>
          <div class="whitespace-pre overflow-auto border font-mono text-xs max-h-12">
            ${JSON.stringify(this.doidConnector.addresses, undefined, 1)}
          </div>
          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connection status</h1>
          <p>Wallet connected: <code>${this.doidConnector.ready}</code></p>
          <p>DOID connected: <code>${this.doidConnector.connected}</code></p>
          ${when(
            this.doidConnector.connected,
            () => html`
              <p>Address: <code>${this.doidConnector.account}</code></p>
              <p>ChainId: <code>${this.doidConnector.chainId}</code></p>
              <p>DOID: <code>${this.doidConnector.doid}</code></p>
              <dui-button sm @click=${() => this.doidConnector.disconnect()}>Disconnect</dui-button>
            `
          )}

          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connection status(ethers)</h1>
          <p>Signer: <code>${this.accountEthers ?? typeof this.accountEthers}</code></p>

          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Resolve DOID</h1>
          <dui-drop
            icon
            btnSm
            .show=${this.doidNetworkMenu}
            @change=${(e: CustomEvent) => (this.doidNetworkMenu = e.detail)}
          >
            <p slot="button">${this.doidNetwork?.name ?? 'select doid network'}</p>
            <ul class="dui-option">
              <li @click="${this.switchNetwork.bind(this, doid)}" class="text-base">${doid.name}</li>
              <li @click="${this.switchNetwork.bind(this, doidTestnet)}" class="text-base">${doidTestnet.name}</li>
              <li @click="${this.switchNetwork.bind(this, fantomTestnet)}" class="text-base">${fantomTestnet.name}</li>
            </ul>
          </dui-drop>
          <dui-input-text id="address" placeholder="address" class="max-w-sm flex my-1">
            <p slot="msg">doid result: ${this.doidResult}<br />ens result: ${this.ensResult}</p>
          </dui-input-text>
          <dui-button sm @click=${() => this.getDOID(this.$('#address').value)}><p>Get DOID</p></dui-button>
        </div>
        <div class="flex-auto">
          <h1 class="font-bold text-xl pb-1 mt-8 mb-4 border-b">Connect with DOID connect button</h1>
          <doid-connect-button ${ref(this.connectButtonRef)} appName="DOID Connect Demo"></doid-connect-button>
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
          >
            <p slot="msg">This default ID can only be used on doid.tech</p>
          </dui-input-text>
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
