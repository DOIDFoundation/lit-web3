import { customElement, TailwindElement, html, property, when, map } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/dialog'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/input/text'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { CHAIN_NAMESPACES } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { Connector, InjectedConnector } from '@wagmi/core'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'

import style from './dialog.css?inline'
import iconMetamask from '../icons/metamask.svg'
import iconCoinbase from '../icons/coinbase.svg'
import iconWalletConnect from '../icons/walletconnect.svg'
import { controller } from './controller'
import { options } from './options'

@customElement('doid-connect-dialog')
export class DOIDConnectDialog extends TailwindElement(style) {
  @property({ type: String }) appName = undefined

  private web3authInstance: Web3AuthNoModal | undefined

  get wallets() {
    let wallets: Connector[] = [
      new MetaMaskConnector(),
      new CoinbaseWalletConnector({ options: { appName: this.appName ?? 'DOID' } })
    ].filter((wallet) => wallet.ready)
    let injected = new InjectedConnector()
    if (injected.ready && wallets.findIndex((wallet) => wallet.name == injected.name) < 0) {
      wallets.push(injected)
    }
    if (options.walletConnectId) {
      let wc = new WalletConnectConnector({
        options: {
          projectId: options.walletConnectId!
        }
      })
      if (wc.ready) wallets.push(wc)
    }
    return wallets
  }

  constructor() {
    super()
  }

  get isWeb3AuthEnabled() {
    return options.web3AuthClientId
  }

  getWalletIcon(connector: any) {
    switch (connector.name) {
      case 'MetaMask':
        return iconMetamask
      case 'Coinbase Wallet':
        return iconCoinbase
      case 'WalletConnect':
        return iconWalletConnect
    }
    return undefined
  }

  getWalletImage(connector: any) {
    let icon = this.getWalletIcon(connector)
    if (icon) return html`<img class="m-auto w-6 h-6 object-contain select-none pointer-events-none" src="${icon}" />`
    else return html`<i class="mdi mdi-puzzle-outline text-xl"></i> `
  }

  getWeb3auth() {
    if (this.web3authInstance) return this.web3authInstance
    if (!this.isWeb3AuthEnabled) {
      throw new Error('Web3Auth Client ID is not configured.')
    }

    let chains = options.chains!
    const chainConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: '0x' + chains[0].id.toString(16),
      rpcTarget: chains[0].rpcUrls.default.http[0],
      displayName: chains[0].name,
      tickerName: chains[0].nativeCurrency?.name,
      ticker: chains[0].nativeCurrency?.symbol,
      blockExplorer: chains[0].blockExplorers?.default?.url
    }
    let web3auth = new Web3AuthNoModal({
      clientId: options.web3AuthClientId!, // Get your Client ID from the Web3Auth Dashboard
      web3AuthNetwork: options.web3AuthNetwork,
      chainConfig
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

  close() {
    this.remove()
    this.emit('close')
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

  connect(connector: any) {
    controller.setConnector(connector)
    return controller.connect()
  }

  override render() {
    return html`<dui-dialog @close=${this.close}>
      <div slot="header" class="w-16 mx-auto mt-6 pl-4">
        <doid-icon sm></doid-icon>
      </div>
      <div class="mb-8 -mt-2 text-center font-medium">
        <h1 class="text-2xl mb-4">Welcome</h1>
        ${when(
          this.appName,
          () => html`<p>Unlock your DOID to continue to ${this.appName}.</p>`,
          () => html`<p>Unlock your DOID to continue.</p>`
        )}
      </div>
      <div class="px-6 mt-2 text-center font-medium">
        <div class="button-container">
          ${map(
            this.wallets,
            (wallet) => html`
              <button class="flex-none button" @click=${this.connect.bind(this, wallet)}>
                ${this.getWalletImage(wallet)}
              </button>
            `
          )}
          ${when(
            this.isWeb3AuthEnabled,
            () => html`
              <dui-button icon @click=${() => this.connectWeb3Auth('google')}>
                <i class="mdi mdi-google text-xl"></i>
              </dui-button>
              <dui-button icon @click=${() => this.connectWeb3Auth('apple')}>
                <i class="mdi mdi-apple text-xl"></i>
              </dui-button>
              <dui-button icon @click=${() => this.connectWeb3Auth('facebook')}>
                <i class="mdi mdi-facebook text-xl"></i>
              </dui-button>
              <dui-button icon @click=${() => this.connectWeb3Auth('twitter')}>
                <i class="mdi mdi-twitter text-xl"></i>
              </dui-button>
              <dui-button icon @click=${() => this.connectWeb3Auth('github')}>
                <i class="mdi mdi-github text-xl"></i>
              </dui-button>
            `
          )}
        </div>
        <div class="separator mt-4"></div>
        <p>
          Don't have a DOID?
          <dui-link class="block">Sign up</dui-link>
        </p>
      </div>
    </dui-dialog>`
  }
}
