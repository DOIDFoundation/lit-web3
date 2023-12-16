import { LitElement, PropertyValueMap, html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { map } from 'lit/directives/map.js'
import './components/signup'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'

import { Web3AuthNoModal } from '@web3auth/no-modal'
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { Chain, ChainNotConfiguredError, Connector, InjectedConnector } from '@wagmi/core'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'

import TailwindBase from './tailwind.global.css?inline'
import style from './connectDialog.css?inline'
import iconMetamask from '../icons/metamask.svg'
import iconCoinbase from '../icons/coinbase.svg'
import iconWalletConnect from '../icons/walletconnect.svg'
import iconPuzzle from '../icons/puzzle.svg'
import iconDOID from '../icons/doid.svg'
import { ConnectorData, ErrNotRegistered, controller } from './controller'
import { options } from './options'
import { googleSvg } from './assets/svg/google'
import { appleSvg } from './assets/svg/apple'
import { facebookSvg } from './assets/svg/facebook'
import { twitterSvg } from './assets/svg/twitter'
import { githubSvg } from './assets/svg/github'
import EventEmitter from 'eventemitter3'
import { createRef, ref } from 'lit/directives/ref.js'
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import { DOIDSignup } from './components/signup'

export interface Events {
  connect(data: ConnectorData): void
  close(): void
  error(error: Error): void
}

@customElement('doid-connect-dialog')
export class DOIDConnectDialog extends LitElement {
  @property({ type: String }) appName = ''
  @property({ type: Boolean }) signup = false
  @property() chainId?: Chain['id']
  @state() signupAccount?: Address

  static styles = [unsafeCSS(TailwindBase), unsafeCSS(style)]

  public readonly events = new EventEmitter<Events>()
  protected emit = this.events.emit.bind(this.events)
  public on = this.events.on.bind(this.events)
  public once = this.events.once.bind(this.events)
  public off = this.events.off.bind(this.events)

  private web3authInstance: Web3AuthNoModal | undefined

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)
    this.show()
  }

  get connectors() {
    let connectors: Connector[] = [
      new MetaMaskConnector({ chains: options.chains }),
      new CoinbaseWalletConnector({ chains: options.chains, options: { appName: this.appName ?? 'DOID' } })
    ].filter((wallet) => wallet.ready)
    let injected = new InjectedConnector({ chains: options.chains })
    if (injected.ready && connectors.findIndex((wallet) => wallet.name == injected.name) < 0) {
      connectors.push(injected)
    }
    if (options.walletConnectId) {
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
    if (!options.web3AuthClientId) {
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
      clientId: options.web3AuthClientId, // Get your Client ID from the Web3Auth Dashboard
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

  private dialogRef = createRef<SlDialog>()
  show() {
    return this.updateComplete.then(() => {
      return this.dialogRef.value?.show()
    })
  }

  /**
   * @fires DOIDConnectDialog.EVENTS.CLOSE
   */
  close() {
    this.dialogRef.value?.hide().then(() => {
      this.remove()
      this.emit('close')
    })
  }

  connectWeb3Auth(provider: any) {
    return this.connect(
      new Web3AuthConnector({
        chains: options.chains,
        options: {
          web3AuthInstance: this.getWeb3auth(),
          loginParams: {
            loginProvider: provider
          }
        }
      })
    )
  }

  private signupRef = createRef<DOIDSignup>()
  /**
   * Connect wallet wtih connector
   * @param {Connector} connector wagmi connector
   * @returns wallet connection promise
   * @fires DOIDConnectDialog.EVENTS.CONNECTED
   * @fires DOIDConnectDialog.EVENTS.ERROR
   */
  private async connect(connector: any): Promise<ConnectorData> {
    const chainId = this.chainId
    try {
      let result = await controller.connect({ chainId, connector })
      this.emit('connect', result)
      this.close()
      return result
    } catch (error) {
      if (error instanceof ErrNotRegistered) {
        this.signup = true
        this.signupAccount = error.account
        return new Promise<ConnectorData>(async (resolve, reject) => {
          await this.updateComplete
          this.signupRef.value!.on('signup', async (name) => {
            try {
              let result = await controller.connect({ chainId, connector })
              this.emit('connect', result)
              this.close()
              resolve(result)
            } catch (e) {
              reject(e)
            }
          })
        })
      } else if (error instanceof Error) {
        this.emit('error', error)
        throw error
      }
    }
  }

  override render() {
    return html`<sl-dialog label="Connect your DOID" no-header @sl-after-hide=${this.close} ${ref(this.dialogRef)}>
      <div class="w-16 h-16 mx-auto mt-5">
        <img class="w-full h-full" src="${iconDOID}" />
      </div>
      ${when(
        !this.signup,
        this.renderConnect.bind(this),
        () => html`<doid-signup .account=${this.signupAccount} ${ref(this.signupRef)}></doid-signup>`
      )}
    </sl-dialog>`
  }

  renderConnect() {
    return html`
      <div class="my-6 text-center font-medium">
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
        <p>Don't have a DOID?</p>
        <sl-button
          variant="text"
          @click=${() => {
            this.signup = true
          }}
          >Sign up</sl-button
        >
      </div>
    `
  }
}
