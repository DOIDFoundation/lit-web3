import { JsonRpcProvider, Web3Provider, WebSocketProvider } from '@ethersproject/providers'
import Network from './networks'
import emitter from '@lit-web3/core/src/emitter'

class Provider {
  public provider: Web3Provider | JsonRpcProvider | WebSocketProvider | any
  public network: any
  public storage: any
  constructor(chainId?: ChainId) {
    this.storage = sessionStorage.getItem('chainId')
    if (!chainId) {
      // !!! ethereum.chainId is deprecated, but this may make getter faster
      if (window.ethereum?.chainId) chainId = window.ethereum.chainId
      else if (this.storage) chainId = this.storage
    }
    this.network = new Network(chainId, { disableMainnet: false })
    this.provider = this.update(chainId)
  }
  update(chainId?: ChainId) {
    const { ethereum } = window
    // !!! ethereum.chainId is deprecated, but this may make getter faster
    if (ethereum?.chainId && chainId != ethereum.chainId) chainId = ethereum.chainId
    if (this.provider) {
      if (chainId == this.network.chainId) return
      this.provider.removeAllListeners()
    }

    if (chainId) {
      this.network.chainId = chainId
      this.storage = sessionStorage.setItem('chainId', chainId)
    }
    if (ethereum) {
      this.provider = new Web3Provider(ethereum)
    } else {
      this.provider = this.network.providerWs
        ? new WebSocketProvider(this.network.providerWs)
        : new JsonRpcProvider(this.network.provider)
    }
    emitter.emit('network-change', '')
    return this.provider
  }
  get request() {
    const { ethereum } = window
    return ethereum?.request ?? this.provider.send
  }
}

const provider = new Provider()

export default provider
