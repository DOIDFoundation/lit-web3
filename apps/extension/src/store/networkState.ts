export { StateController } from '@lit-app/state'
import popupMessenger from '~/lib.next/messenger/popup'
import { State, property } from '@lit-app/state'
import { multiChain } from '@lit-web3/chain/src'

type EnabledMultiChain = {
  [symbol: string]: ChainNetworks
}
// Sync ui's networks state from backend
class UINetworks extends State {
  @property({ value: false }) pending!: boolean
  @property({ value: 0 }) ts!: number
  @property({ value: {} }) preferNetworks!: PreferNetworks
  @property({ value: true }) showtest!: ChainNetworks
  // Chain Tabs
  @property({ value: [] }) chainTabs!: BlockChains
  @property({ value: 'ethereum' }) currentChainName!: ChainName
  @property({ value: 'ETH' }) currentChainSymbol!: string

  get enabledMultiChain(): EnabledMultiChain {
    if (this.showtest) return multiChain
    else
      return Object.fromEntries(
        Object.entries(multiChain).map(([name, networks]) => {
          const _networks = networks.filter((r) => !r.testnet)
          return [name, _networks]
        })
      ) as MultiChain
  }
  get inited() {
    return !!this.ts
  }
  // Current Chain Tab (show only)
  get currentBlockchain() {
    return this.chainTabs.find((chain) => chain.symbol === this.currentChainSymbol)
  }
  get currentNetworks() {
    return this.enabledMultiChain[this.currentChainName]
  }
  get currentPreferNetwork() {
    return this.preferNetworks[this.currentChainName]
  }
  get currentNetwork() {
    return this.currentNetworks.find((network) => network.id === this.currentPreferNetwork?.id)
  }

  selectChain = (chain: ChainNetwork) => {
    this.currentChainName = chain.name
    this.currentChainSymbol = chain.symbol
  }

  switchNetwork = async (chainName: ChainName, id: ChainId) => {
    await this.set({ [chainName]: { id } } as PreferNetworks)
  }

  reset() {
    Object.assign(this, { DOIDs: undefined, selectedDOID: {} })
  }

  get = (chainName = this.currentChainName): ChainNetwork => {
    const networks = this.enabledMultiChain[chainName]
    const { id: savedChainId } = this.preferNetworks[chainName]
    return networks.find((network) => savedChainId === network.id)!
  }

  set = async (networks: PreferNetworks) => {
    this.pending = true
    try {
      await popupMessenger.send('internal_setNetworks', { networks })
      this.sync()
    } catch {}
    this.ts++
    this.pending = false
  }

  sync = async () => {
    this.pending = true
    try {
      const { networks } = await popupMessenger.send('internal_getNetworks')
      this.preferNetworks = networks
      // Update ChainTabs
      const chainTabs = Object.values(this.enabledMultiChain)
        .map((networks) => networks[0])
        .filter((network) => !['doid', 'bitcoin'].includes(network.name))
      // BNB
      const BNB = this.enabledMultiChain.ethereum.find((network) => network.symbol === 'BNB')!
      const idx = chainTabs.findIndex((network) => network.name === 'ethereum')
      chainTabs.splice(idx + 1, 0, BNB)
      this.chainTabs = chainTabs
    } catch {}
    this.ts++
    this.pending = false
  }

  constructor() {
    super()
    this.sync()
  }
}

export const uiNetworks = new UINetworks()
popupMessenger.on('network_change', uiNetworks.sync)
