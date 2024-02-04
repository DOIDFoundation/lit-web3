import { html, TailwindElement, customElement, property, state, when } from '@lit-web3/base/tailwind-element'
// import { customElement, property, state } from 'lit/decorators.js'
// import { when } from 'lit/directives/when.js'
import { map } from 'lit/directives/map.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js'
import './spinner'
import { Connector, ConnectorState, controller } from '../controller'
import { Chain } from '../chains'
import { googleSvg } from '../assets/svg/google'
import { appleSvg } from '../assets/svg/apple'
import { facebookSvg } from '../assets/svg/facebook'
import { twitterSvg } from '../assets/svg/twitter'
import { githubSvg } from '../assets/svg/github'
import { moreSvg } from '../assets/svg/more'
import iconCoinbase from '../assets/icons/coinbase.svg?inline'
import iconWalletConnect from '../assets/icons/walletconnect.svg?inline'
import iconPuzzle from '../assets/icons/puzzle.svg?inline'
import style from './connectButtons.css?inline'
import { EventTypes, stopPropagation } from '../utils/events'
import { TemplateResult } from 'lit'
import { web3auth } from '../connector/web3auth'
import { injected } from '@wagmi/core'

export interface Events {
  connect: EventTypes.DetailedEvent<ConnectorState>
  error: EventTypes.DetailedEvent<Error>
}

@customElement('doid-connect-buttons')
export class DOIDConnectButtons extends TailwindElement([style]) {
  @property() chainId?: Chain['id']
  @state() connecting = false
  @state() connectingProvider = ''

  getConnectorIcon(connector: any): TemplateResult {
    if (connector.icon) return html`<img src="${connector.icon}" />`
    var svg
    switch (connector.name) {
      case 'Coinbase Wallet':
        svg = iconCoinbase
        break
      case 'WalletConnect':
        svg = iconWalletConnect
        break
      // @todo import from web3auth
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
      case 'more':
        return moreSvg
      default:
        svg = iconPuzzle
        break
    }
    return html`<sl-icon label="${connector.name}" src="${svg}"></sl-icon>`
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
    this.connectingProvider = connector.uid
    return controller
      .connect({ chainId: this.chainId, connector })
      .then((result) => {
        this.emit('connect', result)
        this.connecting = false
      })
      .catch((error) => {
        this.emit('error', error)
        console.debug(`Connect failed with error: '${error.message}'`)
        this.connecting = false
      })
  }

  override render() {
    return html`
      <div class="button-container">
        ${map(
          [
            ...controller.availableConnectors().filter((x) => (x.type == injected.type ? x : undefined)),
            ...controller
              .availableConnectors()
              .filter((x) => (([web3auth.type, injected.type] as string[]).includes(x.type) ? undefined : x)),
            ...controller.availableConnectors().filter((x) => (x.type == web3auth.type ? x : undefined))
          ],
          (connector) => html`
            <sl-tooltip placement="bottom" content="${connector.name}" @sl-after-hide=${stopPropagation}>
              <sl-button circle size="medium" ?disabled=${this.connecting} @click=${() => this.connect(connector)}>
                ${this.getConnectorIcon(connector)}
                ${when(
                  this.connecting && this.connectingProvider == connector.uid,
                  () => html`<doid-spinner></doid-spinner>`
                )}
              </sl-button>
            </sl-tooltip>
          `
        )}
      </div>
    `
  }
}
