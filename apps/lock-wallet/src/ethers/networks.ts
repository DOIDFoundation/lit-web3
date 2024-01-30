import { walletStore } from './bridge'
import { AllNetworks, unknownNetwork, SupportNetworks } from './constants/networks'
import { State, property, reflectProperty, reflectSubProperty } from './state'

const isProd = import.meta.env.MODE === 'production'
const mainnetOffline = !!import.meta.env.VITE_DISABLE_MAINNET
export const Networks: Networks = AllNetworks

export const [mainnetChainId, testnet] = SupportNetworks
export const defaultChainId = isProd && !mainnetOffline ? mainnetChainId : import.meta.env.VITE_DEF_TESTNET ?? testnet

// This may return wrong network value if no req provided
// If you want to get current network, please use `userBridge/getNetwork` instead
export const getNetwork = (req?: string, exactly: boolean = false): NetworkInfo => {
  const def = exactly
    ? unknownNetwork
    : Networks[Network.chainId] ?? Networks[Network.defaultChainId] ?? Networks[mainnetChainId]
  if (req === undefined) return def
  let res = Networks[req] ?? Object.values(Networks).find((r) => r.name === req)
  return res ?? def
}

export class Network extends State {
  public static readonly mainnetChainId: ChainId = mainnetChainId
  public static readonly defaultChainId: ChainId = defaultChainId
  public static chainId: ChainId
  public opts: Record<string, unknown> = {}
  @property() chainId?: ChainId
  constructor(chainId?: ChainId, opts = {}) {
    super()
    this.chainId = Network.chainId = chainId ?? walletStore.wallet?.chainId ?? Network.defaultChainId
    // ensure this.chainId=walletStore.wallet?.chainId ?? undefined
    reflectSubProperty(walletStore, 'wallet', 'chainId', this)
    // ensure Network.chainId=this.chainId
    reflectProperty(this, 'chainId', Network)
    Object.assign(this.opts, opts)
  }
  get Networks() {
    return Networks
  }
  get isMainnet() {
    return this.chainId ? [Network.mainnetChainId].includes(this.chainId) : false
  }
  get current() {
    return this.chainId ? this.Networks[this.chainId] ?? unknownNetwork : unknownNetwork
  }
  get default() {
    return this.Networks[defaultChainId]
  }
  get unSupported() {
    return this.current.name === 'unknown'
  }
  get isDefaultNet() {
    return this.current.chainId === defaultChainId
  }
  get mainnetOffline() {
    return this.isMainnet && mainnetOffline
  }
  get disabled() {
    return this.unSupported || this.mainnetOffline
  }
  get isTestnet() {
    return this.current.name === 'testnet'
  }
  get provider() {
    return this.current.provider
  }
  get providerWs() {
    return this.current.providerWs
  }
  get title() {
    return this.isMainnet ? '' : this.current.title
  }
  get name() {
    return this.current.name
  }
}
export default Network
