import '@lit-web3/core/src/shims/node'
import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { map } from 'lit/directives/map.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import './spinner'
import { controller } from '../controller'
import { options } from '../options'
import { googleSvg } from '../assets/svg/google'
import { appleSvg } from '../assets/svg/apple'
import { facebookSvg } from '../assets/svg/facebook'
import { twitterSvg } from '../assets/svg/twitter'
import { githubSvg } from '../assets/svg/github'
import iconMetamask from '../assets/icons/metamask.svg'
import iconCoinbase from '../assets/icons/coinbase.svg'
import iconWalletConnect from '../assets/icons/walletconnect.svg'
import iconPuzzle from '../assets/icons/puzzle.svg'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { LOGIN_PROVIDER_TYPE, OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { Chain, ConnectorData, ChainNotConfiguredError, Connector, InjectedConnector } from '@wagmi/core'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { BaseCss } from './globalCSS'
import style from './connectButtons.css?inline'
import { EventTypes } from '../utils/events'

export interface Events {
  connect: EventTypes.DetailedEvent<ConnectorData>
  error: EventTypes.DetailedEvent<Error>
}

@customElement('doid-connect-buttons')
export class DOIDConnectButtons extends LitElement {
  @property() chainId?: Chain['id']
  @state() connecting = false
  @state() connectingProvider = ''

  static styles = [BaseCss, unsafeCSS(style)]

  // Element Events
  emit<T extends EventTypes.EventNames<Events>>(type: T, detail?: EventTypes.EventDetailType<Events, T>, options = []) {
    if (!detail) this.dispatchEvent(new Event(type, { bubbles: false, composed: false, ...options }))
    else this.dispatchEvent(new CustomEvent(type, { detail, bubbles: false, composed: false, ...options }))
  }
  on<T extends EventTypes.EventNames<Events>>(type: T, listener: EventTypes.EventListenerFn<Events, T>, options?: any) {
    this.addEventListener(type, listener as EventListener, options)
  }

  private web3authInstance: Web3AuthNoModal | undefined

  get connectors() {
    let connectors: Connector[] = [
      new MetaMaskConnector({ chains: options.chains }),
      new CoinbaseWalletConnector({ chains: options.chains, options: { appName: options.appName ?? 'DOID' } })
    ].filter((wallet) => wallet.ready)
    let injected = new InjectedConnector({ chains: options.chains })
    if (injected.ready && connectors.findIndex((wallet) => wallet.name == injected.name) < 0) {
      connectors.push(injected)
    }
    if (options.walletConnectEnabled) {
      debugger
      let wc = new WalletConnectConnector({
        chains: options.chains,
        options: {
          projectId: options.walletConnectId!
        }
      })
      if (wc.ready) connectors.push(wc)
    }
    return connectors
  }
  get isWeb3AuthEnabled() {
    return options.web3AuthEnabled
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

  getWeb3AuthIcon(provider: LOGIN_PROVIDER_TYPE) {
    // @todo import from web3auth
    switch (provider) {
      case 'google':
        return googleSvg
      case 'apple':
        return appleSvg
      case 'facebook':
        return facebookSvg
      case 'twitter':
        return twitterSvg
      case 'github':
        return githubSvg
      default:
        throw new Error(`Provider "${provider}" is not supported yet.`)
    }
  }

  getWeb3Auth() {
    if (this.web3authInstance) return this.web3authInstance
    if (this.isWeb3AuthEnabled && !options.web3AuthClientId) {
      throw new Error('Web3Auth Client ID is not configured.')
    }

    let chains = options.chains!
    let chain = this.chainId ? chains.find((c) => c.id == this.chainId) : chains[0]
    if (!chain)
      throw this.chainId
        ? new ChainNotConfiguredError({ chainId: this.chainId, connectorId: 'Web3Auth' })
        : new Error('chains is not configured.')
    const chainConfig = {
      chainId: '0x' + chain.id.toString(16),
      rpcTarget: chain.rpcUrls.default.http[0],
      displayName: chain.name,
      tickerName: chain.nativeCurrency?.name,
      ticker: chain.nativeCurrency?.symbol,
      blockExplorer: chain.blockExplorers?.default?.url ?? ''
    }
    let web3auth = new Web3AuthNoModal({
      clientId: options.web3AuthClientId!,
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

  connectWeb3Auth(provider: LOGIN_PROVIDER_TYPE) {
    return this.connect(
      new Web3AuthConnector({
        chains: options.chains,
        options: {
          web3AuthInstance: this.getWeb3Auth(),
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
   * @fires "connect"
   * @fires "error"
   */
  private connect(connector: Connector) {
    this.connecting = true
    this.connectingProvider =
      connector instanceof Web3AuthConnector ? connector.options.loginParams!.loginProvider : connector.name
    return controller
      .connect({ chainId: this.chainId, connector })
      .then((result) => {
        this.emit('connect', result)
        this.connecting = false
      })
      .catch((error) => {
        console.debug(`Connect failed with error: '${error.message}'`)
        this.emit('error', error)
        this.connecting = false
      })
  }

  override render() {
    return html`
      <div class="button-container">
        ${map(
          this.connectors,
          (connector) => html`
            <sl-button size="medium" ?disabled=${this.connecting} circle @click=${this.connect.bind(this, connector)}>
              ${when(
                this.connecting && this.connectingProvider == connector.name,
                () => html`<doid-spinner></doid-spinner>`
              )}
              <img src="${this.getConnectorIcon(connector)}" />
            </sl-button>
          `
        )}
        ${when(
          this.isWeb3AuthEnabled,
          () => html`
            ${map(
              options.web3AuthProviders,
              (provider) =>
                html`<sl-button
                  size="medium"
                  ?disabled=${this.connecting}
                  circle
                  @click=${this.connectWeb3Auth.bind(this, provider)}
                  >${when(
                    this.connecting && this.connectingProvider == provider,
                    () => html`<doid-spinner></doid-spinner>`
                  )}${this.getWeb3AuthIcon(provider)}</sl-button
                >`
            )}
          `
        )}
      </div>
    `
  }
}
