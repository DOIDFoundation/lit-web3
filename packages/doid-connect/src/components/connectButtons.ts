import { html, TailwindElement, customElement, property, state, when } from '@lit-web3/base/tailwind-element'
// import { customElement, property, state } from 'lit/decorators.js'
// import { when } from 'lit/directives/when.js'
import { map } from 'lit/directives/map.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js'
import './spinner'
import { controller } from '../controller'
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
import style from './connectButtons.css?inline'
import { EventTypes, stopPropagation } from '../utils/events'

export interface Events {
  connect: EventTypes.DetailedEvent<ConnectorData>
  error: EventTypes.DetailedEvent<Error>
}

@customElement('doid-connect-buttons')
export class DOIDConnectButtons extends TailwindElement([style]) {
  @property() chainId?: Chain['id']
  @state() connecting = false
  @state() connectingProvider = ''

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

  connectWeb3Auth = (provider: LOGIN_PROVIDER_TYPE) => {
    return this.connect(controller.web3AuthConnector(provider))
  }
  /**
   * Connect wallet wtih connector
   * @param {Connector} connector wagmi connector
   * @returns wallet connection promise
   * @fires "connect"
   * @fires "error"
   */
  private connect = (connector: Connector) => {
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
            <sl-tooltip placement="bottom" content="${connector.name}" @sl-after-hide=${stopPropagation}>
              <sl-button circle size="medium" ?disabled=${this.connecting} @click=${() => this.connect(connector)}>
                <sl-icon label="${connector.name}" src="${this.getConnectorIcon(connector)}"></sl-icon>
                ${when(
                  this.connecting && this.connectingProvider == connector.name,
                  () => html`<doid-spinner></doid-spinner>`
                )}
              </sl-button>
            </sl-tooltip>
          `
        )}
        ${when(
          controller.web3AuthEnabled,
          () => html`
            ${map(
              controller.web3AuthProviders,
              (provider) => html`
                <sl-tooltip placement="bottom" content="${provider}" @sl-after-hide=${stopPropagation}>
                  <sl-button
                    size="medium"
                    ?disabled=${this.connecting}
                    circle
                    @click=${() => this.connectWeb3Auth(provider)}
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
