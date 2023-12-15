import { LitElement, PropertyValueMap, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { map } from 'lit/directives/map.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'

import { Web3AuthNoModal } from '@web3auth/no-modal'
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { Connector, InjectedConnector } from '@wagmi/core'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'

import TailwindBase from './tailwind.global.css?inline'
import style from './dialog.css?inline'
import iconMetamask from '../icons/metamask.svg'
import iconCoinbase from '../icons/coinbase.svg'
import iconWalletConnect from '../icons/walletconnect.svg'
import iconPuzzle from '../icons/puzzle.svg'
import iconDOID from '../icons/doid.svg'
import { controller } from './controller'
import { options } from './options'
import { googleSvg } from './assets/svg/google'
import { appleSvg } from './assets/svg/apple'
import { facebookSvg } from './assets/svg/facebook'
import { twitterSvg } from './assets/svg/twitter'
import { githubSvg } from './assets/svg/github'

@customElement('doid-connect-dialog')
export class DOIDConnectDialog extends LitElement {
  @property({ type: String }) appName = ''

  static styles = [unsafeCSS(TailwindBase), unsafeCSS(style)]

  /** Events emitted. */
  static readonly EVENTS = {
    /**
     * Connected event.
     *
     * @event DOIDConnectDialog#connected
     * @type {object}
     * @property {ConnectorData} result - connect wallet result.
     */
    CONNECTED: 'connected',
    /**
     * Connection failed event.
     *
     * @event DOIDConnectDialog#error
     * @type {Error}
     */
    ERROR: 'error',
    /** Dialog closed event. */
    CLOSE: 'close'
  }

  private web3authInstance: Web3AuthNoModal | undefined

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)
    this.show()
  }

  // Element Events
  emit<T>(type: string, detail?: T, options = []) {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: false, composed: false, ...options }))
  }

  get connectors() {
    let connectors: Connector[] = [
      new MetaMaskConnector(),
      new CoinbaseWalletConnector({ options: { appName: this.appName ?? 'DOID' } })
    ].filter((wallet) => wallet.ready)
    let injected = new InjectedConnector()
    if (injected.ready && connectors.findIndex((wallet) => wallet.name == injected.name) < 0) {
      connectors.push(injected)
    }
    if (options.walletConnectId) {
      let wc = new WalletConnectConnector({
        options: {
          projectId: options.walletConnectId!
        }
      })
      if (wc.ready) connectors.push(wc)
    }
    return connectors
  }

  constructor() {
    super()
  }

  get isWeb3AuthEnabled() {
    return options.web3AuthClientId
  }

  getConnectorIcon(connector: any) {
    switch (connector.name) {
      case 'MetaMask':
        return iconMetamask
      case 'Coinbase Wallet':
        return iconCoinbase
      case 'WalletConnect':
        return iconWalletConnect
      default:
        return iconPuzzle
    }
  }

  getWeb3auth() {
    if (this.web3authInstance) return this.web3authInstance
    if (!this.isWeb3AuthEnabled) {
      throw new Error('Web3Auth Client ID is not configured.')
    }

    let chains = options.chains!
    const chainConfig = {
      chainId: '0x' + chains[0].id.toString(16),
      rpcTarget: chains[0].rpcUrls.default.http[0],
      displayName: chains[0].name,
      tickerName: chains[0].nativeCurrency?.name,
      ticker: chains[0].nativeCurrency?.symbol,
      blockExplorer: chains[0].blockExplorers?.default?.url ?? ''
    }
    let web3auth = new Web3AuthNoModal({
      clientId: options.web3AuthClientId!, // Get your Client ID from the Web3Auth Dashboard
      web3AuthNetwork: options.web3AuthNetwork,
      chainConfig: { ...chainConfig, chainNamespace: CHAIN_NAMESPACES.EIP155 }
    })
    this.web3authInstance = web3auth

    web3auth.configureAdapter(
      new OpenloginAdapter({
        privateKeyProvider: new EthereumPrivateKeyProvider({
          config: { chainConfig }
        })
      })
    )
    return web3auth
  }

  show() {
    return this.updateComplete.then(() => {
      return this.shadowRoot?.querySelector('sl-dialog')?.show()
    })
  }

  /**
   * @fires DOIDConnectDialog.EVENTS.CLOSE
   */
  close() {
    this.shadowRoot
      ?.querySelector('sl-dialog')
      ?.hide()
      .then(() => {
        this.remove()
        this.emit(DOIDConnectDialog.EVENTS.CLOSE)
      })
  }

  connectWeb3Auth(provider: any) {
    return this.connect(
      new Web3AuthConnector({
        options: {
          web3AuthInstance: this.getWeb3auth(),
          loginParams: {
            loginProvider: provider
          }
        }
      })
    )
  }

  /**
   * Connect wallet wtih connector
   * @param {Connector} connector wagmi connector
   * @returns wallet connection promise
   * @fires DOIDConnectDialog.EVENTS.CONNECTED
   * @fires DOIDConnectDialog.EVENTS.ERROR
   */
  connect(connector: any) {
    return controller
      .connect(connector)
      .then((result) => {
        this.emit(DOIDConnectDialog.EVENTS.CONNECTED, result)
        this.close()
        return result
      })
      .catch((error) => {
        this.emit(DOIDConnectDialog.EVENTS.ERROR, error)
        return error
      })
  }

  override render() {
    return html`<sl-dialog label="Connect your DOID" no-header @sl-after-hide=${this.close}>
      <div class="w-16 h-16 mx-auto mt-5">
        <img class="w-full h-full" src="${iconDOID}" />
      </div>
      <div class="mb-6 mt-6 text-center font-medium">
        <h1 class="text-2xl mb-4">Welcome</h1>
        ${when(
          this.appName,
          () => html`<p>Unlock your DOID to continue to ${this.appName}.</p>`,
          () => html`<p>Unlock your DOID to continue.</p>`
        )}
      </div>
      <div class="px-5 pb-5 mt-2 text-center font-medium">
        <div class="button-container">
          ${map(
            this.connectors,
            (connector) => html`
              <sl-button size="medium" circle @click=${this.connect.bind(this, connector)}>
                <img src="${this.getConnectorIcon(connector)}" />
              </sl-button>
            `
          )}
          ${when(
            this.isWeb3AuthEnabled,
            () => html`
              <sl-button size="medium" circle @click=${() => this.connectWeb3Auth('google')}>${googleSvg}</sl-button>
              <sl-button size="medium" circle @click=${() => this.connectWeb3Auth('apple')}>${appleSvg}</sl-button>
              <sl-button size="medium" circle @click=${() => this.connectWeb3Auth('facebook')}>
                ${facebookSvg}
              </sl-button>
              <sl-button size="medium" circle @click=${() => this.connectWeb3Auth('twitter')}>
                ${twitterSvg}
              </sl-button>
              <sl-button size="medium" circle @click=${() => this.connectWeb3Auth('github')}>${githubSvg}</sl-button>
            `
          )}
        </div>
        <div class="separator mt-4"></div>
        <p>
          Don't have a DOID?
          <dui-link class="block">Sign up</dui-link>
        </p>
      </div>
    </sl-dialog>`
  }
}
