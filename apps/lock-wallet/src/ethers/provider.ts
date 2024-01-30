import { JsonRpcProvider, BrowserProvider, WebSocketProvider } from 'ethers'
import Network from './networks'
import { walletStore } from './bridge'
import { State, property } from './state'
import emitter from '@lit-web3/base/emitter'

export class Provider extends State {
  @property() public provider?: BrowserProvider | JsonRpcProvider | WebSocketProvider | any
  @property() public readonly network: Network
  private storage: any
  constructor(options: useBridgeOptions = {}) {
    super()
    const { chainId, persistent } = options
    if (!persistent) this.storage = sessionStorage.getItem('chainId')
    let wallet = walletStore.wallet ?? walletStore.wallets[0].app
    this.network = new Network(chainId ?? wallet?.chainId ?? this.storage)
    if (walletStore.wallet) this.update(options)
    walletStore.subscribe(() => this.update(options), 'wallet')
    this.network.subscribe(() => this.update(options), 'chainId')
  }
  update = async (options: useBridgeOptions = {}) => {
    let { chainId } = this.network
    const { persistent, provider, rpc } = options
    let wallet = walletStore.wallet ?? walletStore.wallets[0].app
    if (!persistent && wallet?.chainId) {
      chainId = wallet.chainId
    }
    // TODO: Allow update when options.rpc changed
    if (this.provider) {
      this.provider.removeAllListeners()
    }
    if (!chainId) {
      this.network.chainId = chainId = Network.defaultChainId
    }
    if (!persistent) this.storage = sessionStorage.setItem('chainId', chainId)
    if (!persistent && wallet) {
      this.provider = await wallet.getProvider()
    } else {
      const _provider = provider || (this.network.providerWs ? WebSocketProvider : JsonRpcProvider)
      const _rpc = rpc || (this.network.providerWs ? this.network.providerWs : this.network.provider)
      this.provider = new _provider(_rpc)
    }
    emitter.emit('network-change', '')
  }
}

let provider: any

export default function (options?: useBridgeOptions) {
  return provider ?? (provider = new Provider(options))
}
