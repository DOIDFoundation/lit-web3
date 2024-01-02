import { JsonRpcProvider, BrowserProvider, WebSocketProvider } from 'ethers'
import Network from './networks'
import emitter from '@lit-web3/base/emitter'
import { getChainId, getChainIdSync } from './detectEthereum'

class Provider {
  public provider: BrowserProvider | JsonRpcProvider | WebSocketProvider | any
  public network: any
  public storage: any
  constructor(options: useBridgeOptions = {}) {
    let { chainId } = options
    const { persistent } = options
    if (!persistent) this.storage = sessionStorage.getItem('chainId')
    // Try chainId
    if (!chainId) {
      // !!! ethereum.chainId is deprecated, but this may make getter faster
      if (window.ethereum?.chainId) chainId = getChainIdSync()
      else if (this.storage) chainId = this.storage
    }
    // Try chainId again
    if (!chainId) getChainId().then((chainId: any) => chainId && this.update({ chainId }))
    // Init
    if (chainId) chainId = `0x${(+chainId).toString(16)}`
    this.network = new Network(chainId)
    this.update({ chainId })
  }
  update = async (options: useBridgeOptions = {}) => {
    let { chainId } = options
    const { persistent, provider, rpc } = options
    if (!persistent) {
      const ethereumChainId = getChainIdSync()
      if (ethereumChainId && chainId != ethereumChainId) chainId = ethereumChainId
    }
    // TODO: Allow update when options.rpc changed
    if (this.provider) {
      if (chainId == this.network.chainId) return
      this.provider.removeAllListeners()
    }
    if (!chainId) chainId = Network.defaultChainId
    this.network.chainId = chainId
    if (!persistent) this.storage = sessionStorage.setItem('chainId', chainId)
    if (!persistent && window.ethereum) {
      this.provider = new BrowserProvider(window.ethereum)
    } else {
      const _provider = provider || (this.network.providerWs ? WebSocketProvider : JsonRpcProvider)
      const _rpc = rpc || (this.network.providerWs ? this.network.providerWs : this.network.provider)
      this.provider = new _provider(_rpc)
    }
    emitter.emit('network-change', '')
  }
  get request() {
    const { ethereum } = window
    return ethereum?.request ?? this.provider.send
  }
}

let provider: any

export default function (options?: useBridgeOptions) {
  return provider ?? (provider = new Provider(options))
}
