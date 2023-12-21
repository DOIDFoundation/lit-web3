import '@doid/node-shims'
import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { map } from 'lit/directives/map.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js'
import './spinner'
import { controller } from '../controller'
import { options } from '../options'
import { googleSvg } from '../assets/svg/google'
import { appleSvg } from '../assets/svg/apple'
import { facebookSvg } from '../assets/svg/facebook'
import { twitterSvg } from '../assets/svg/twitter'
import { githubSvg } from '../assets/svg/github'
import iconMetamask from '../assets/icons/metamask.svg?inline'
import iconCoinbase from '../assets/icons/coinbase.svg?inline'
import iconWalletConnect from '../assets/icons/walletconnect.svg?inline'
import iconPuzzle from '../assets/icons/puzzle.svg?inline'
import { LOGIN_PROVIDER_TYPE } from '@web3auth/openlogin-adapter'
import { Chain, ConnectorData, Connector } from '@wagmi/core'
import { BaseCss } from './globalCSS'
import style from './connectButtons.css?inline'
import { EventTypes, stopPropagation } from '../utils/events'

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

  connectWeb3Auth(provider: LOGIN_PROVIDER_TYPE) {
    return this.connect(controller.web3AuthConnector(provider))
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
    this.connectingProvider = connector.options.loginParams?.loginProvider ?? connector.name
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
          controller.availableConnectors(),
          (connector) => html`
            <sl-tooltip placement="bottom" content="Unlock with ${connector.name}" @sl-after-hide=${stopPropagation}>
              <sl-button circle size="medium" ?disabled=${this.connecting} @click=${this.connect.bind(this, connector)}>
                <sl-icon label="Unlock with ${connector.name}" src="${this.getConnectorIcon(connector)}"></sl-icon>
                ${when(
                  this.connecting && this.connectingProvider == connector.name,
                  () => html`<doid-spinner></doid-spinner>`
                )}
              </sl-button>
            </sl-tooltip>
          `
        )}
        ${when(
          options.web3AuthEnabled,
          () => html`
            ${map(
              options.web3AuthProviders,
              (provider) => html`
                <sl-tooltip placement="bottom" content="Unlock with ${provider}" @sl-after-hide=${stopPropagation}>
                  <sl-button
                    size="medium"
                    ?disabled=${this.connecting}
                    circle
                    @click=${this.connectWeb3Auth.bind(this, provider)}
                  >
                    ${this.getWeb3AuthIcon(provider)}
                    ${when(
                      this.connecting && this.connectingProvider == provider,
                      () => html`<doid-spinner></doid-spinner>`
                    )}
                  </sl-button>
                </sl-tooltip>
              `
            )}
          `
        )}
      </div>
    `
  }
}
