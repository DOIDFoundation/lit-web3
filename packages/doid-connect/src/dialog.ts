import { customElement, TailwindElement, html, property, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
// Components
import '@lit-web3/dui/src/dialog'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/input/text'
import icon from '@lit-web3/ethers/src/wallet/metamask/icon.svg'
import style from './dialog.css?inline'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { CHAIN_NAMESPACES, OPENLOGIN_NETWORK, WALLET_ADAPTERS } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { MetamaskAdapter } from '@web3auth/metamask-adapter'

@customElement('connect-doid-dialog')
export class ConnectDOIDDialog extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: String }) appName: string | undefined
  @property({ type: String }) chainId: string | undefined
  @property({ type: String }) rpcTarget: string | undefined
  @state() step = 1

  private web3authInstance: Web3AuthNoModal | undefined

  constructor() {
    super()
  }

  async getWeb3auth() {
    if (this.web3authInstance) return this.web3authInstance

    const chainConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: this.chainId,
      rpcTarget: 'https://rpc.ankr.com/eth' // This is the mainnet RPC we have added, please pass on your own endpoint while creating an app
    }
    let web3auth = new Web3AuthNoModal({
      clientId: import.meta.env.VITE_WEB3AUTH_CLIENTID, // Get your Client ID from the Web3Auth Dashboard
      web3AuthNetwork:
        import.meta.env.MODE === 'production' ? OPENLOGIN_NETWORK.SAPPHIRE_MAINNET : OPENLOGIN_NETWORK.SAPPHIRE_DEVNET,
      chainConfig
    })
    this.web3authInstance = web3auth

    const privateKeyProvider = new EthereumPrivateKeyProvider({
      config: { chainConfig }
    })

    const openloginAdapter = new OpenloginAdapter({
      adapterSettings: {
        whiteLabel: {
          appName: 'W3A Heroes',
          appUrl: 'https://web3auth.io',
          logoLight: 'https://web3auth.io/images/web3auth-logo.svg',
          logoDark: 'https://web3auth.io/images/web3auth-logo---Dark.svg',
          defaultLanguage: 'en', // en, de, ja, ko, zh, es, fr, pt, nl
          mode: 'auto', // whether to enable dark mode. defaultValue: false
          theme: {
            primary: '#768729'
          },
          useLogoLoader: true
        },
        mfaSettings: {
          deviceShareFactor: {
            enable: true,
            priority: 1,
            mandatory: true
          },
          backUpShareFactor: {
            enable: true,
            priority: 2,
            mandatory: false
          },
          socialBackupFactor: {
            enable: true,
            priority: 3,
            mandatory: false
          },
          passwordFactor: {
            enable: true,
            priority: 4,
            mandatory: false
          }
        }
      },
      loginSettings: {
        mfaLevel: 'mandatory'
      },
      privateKeyProvider
    })
    web3auth.configureAdapter(openloginAdapter)
    await web3auth.init()
    return web3auth
  }

  close() {
    this.remove()
    this.emit('close')
  }

  async connect(provider: any) {
    let web3auth = await this.getWeb3auth()
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: provider
    })
    console.log(web3authProvider)
    console.log(await bridgeStore.bridge.select(1))
  }

  async connectMetamask() {
    console.log(await bridgeStore.bridge.select(0))
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
          <button class="flex-none button" @click=${this.connectMetamask}>
            <img class="m-auto w-5 h-5 object-contain select-none pointer-events-none" src=${icon} />
          </button>
          <dui-button icon @click=${() => this.connect('google')}>
            <i class="mdi mdi-google text-xl"></i>
          </dui-button>
          <dui-button icon @click=${() => this.connect('apple')}>
            <i class="mdi mdi-apple text-xl"></i>
          </dui-button>
          <dui-button icon @click=${() => this.connect('facebook')}>
            <i class="mdi mdi-facebook text-xl"></i>
          </dui-button>
          <dui-button icon @click=${() => this.connect('twitter')}>
            <i class="mdi mdi-twitter text-xl"></i>
          </dui-button>
          <dui-button icon @click=${() => this.connect('github')}>
            <i class="mdi mdi-github text-xl"></i>
          </dui-button>
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
