import { shortAddress } from './utils'
import { Provider } from './provider'
import createProvider from './provider'
import { Wallet, WalletState, emitWalletChange } from './wallet'
import { DoidWallet, importer } from './wallet/doid'
import { State, property, reflectProperty, reflectSubProperty } from './state'
import { JsonRpcApiProvider, JsonRpcSigner } from 'ethers'
import Network from './networks'

export interface WalletApp {
  name: string
  title: string
  icon: string
  app?: Wallet
  import: () => Promise<Wallet>
  state?: WalletState
}

type WalletList = WalletApp[]

/** Available wallet apps */
export const Wallets: WalletList = [importer as WalletApp]

class WalletStore extends State {
  @property({ value: undefined }) wallet?: Wallet
  @property({ value: Wallets }) wallets!: WalletList
  @property({ value: '' }) account: string
  constructor() {
    super()
    this.account = this.wallet?.account ?? ''
    this.subscribe((_, value) => {
      if (!value) this.account = ''
      else reflectProperty(value, 'account', this)
    }, 'wallet')
  }
}
/** Singleton wallet store, to keep current selected wallet. */
export const walletStore = new WalletStore()

export class Bridge extends State {
  private selected: WalletApp | undefined
  private promise: any
  private readonly Provider: Provider
  @property({ skipReset: true }) public readonly store: WalletStore
  @property({ skipReset: true }) public readonly network: Network
  @property({ skipReset: true }) public provider?: JsonRpcApiProvider
  @property({ skipReset: true }) public wallet?: Wallet
  @property({ skipReset: true }) public doid?: string
  @property({ skipReset: true }) public account?: string
  @property({ value: false }) public alreadyTried!: boolean
  constructor(options?: useBridgeOptions) {
    super()
    this.Provider = createProvider(options)
    this.provider = this.Provider.provider
    reflectProperty(this.Provider, 'provider', this)
    this.selected = undefined
    this.promise = undefined
    this.store = walletStore
    this.wallet = walletStore.wallet
    reflectProperty(walletStore, 'wallet', this)
    this.account = this.wallet?.account
    reflectSubProperty(walletStore, 'wallet', 'account', this)
    this.doid = this.wallet?.doid
    reflectSubProperty(walletStore, 'wallet', 'doid', this)
    this.network = this.Provider.network
  }

  async switchNetwork(chainId: ChainId) {
    if (this.wallet) return this.wallet.switchChain(chainId)
    else this.network.chainId = chainId
    this.Provider.update({ chainId })
  }
  async regToken(token: Tokenish, { alt = false, ext = 'svg' } = {}) {
    const { ethereum } = window
    if (!ethereum || !token) return
    const { address, symbol, decimals } = token
    ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC721',
        options: {
          address,
          symbol,
          decimals,
          image: `/${address}/logo${alt ? '-alt' : ''}.${ext}`
        }
      }
    })
  }
  async getSigner(address: string): Promise<JsonRpcSigner> {
    let wallet = this.wallet as DoidWallet
    let signer = await wallet.getSigner(address)
    if (!signer || signer.address != address) {
      console.debug(signer ? `address mismatch, want ${address}, connector is ${signer.address}` : 'can not get signer')
      throw new Error('failed to get signer')
    }
    return signer
  }
  get shortAccount() {
    return shortAddress(this.account ?? '')
  }
  get state() {
    return this.wallet?.state ?? this.selected?.app?.state ?? WalletState.CONNECTING
  }
  get isConnected() {
    return this.state === WalletState.CONNECTED
  }
  connecting: any = undefined
  connectedAccounts: Address[] = []
  async tryConnect(options: useBridgeOptions = {}) {
    const { autoConnect = false } = options
    if (!this.connecting)
      this.connecting = (async () => {
        if (this.wallet?.inited) return
        // detect inited
        await this.wallet?.ensure()
        // TODO: support multi-wallets select
        // force select to doid-connect temporarily
        await this.select(0, false, false)

        if (this.wallet?.injected()) {
          let wallet = (this.wallet ??
            walletStore.wallets[0].app ??
            (await walletStore.wallets[0].import())) as DoidWallet
          if (wallet.state == WalletState.CONNECTED) return
          this.connectedAccounts = await wallet.getAddresses()
          if (this.connectedAccounts[0]) await this.select(0, false)
        }

        this.connecting = undefined
        this.alreadyTried = true
      })()
    return this.connecting
  }
  async connect() {
    return this.wallet?.connect()
  }
  async disconnect() {
    return this.wallet?.disconnect()
  }
  async install() {
    return this.wallet?.install()
  }
  unselect() {
    if (this.selected) {
      this.selected.app?.disconnect()
      this.selected = undefined
    }
  }
  async select(i: number = 0, force = true, connect = true) {
    const selected = (this.selected = walletStore.wallets[i])
    if (!this.promise)
      this.promise = (async () => {
        const wallet = selected.app ?? (await selected.import())
        try {
          if (connect) await wallet.connect({ force })
        } catch (err) {
          throw err
        } finally {
          this.promise = undefined
        }
        // if (wallet.state === WalletState.CONNECTED) this.wallet = walletStore.wallet = wallet
        walletStore.wallet = wallet
        emitWalletChange()
        return this.wallet
      })()
    return this.promise
  }
}

export default Bridge
