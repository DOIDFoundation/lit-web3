// deps: preferences/base.ts
import emitter from '@lit-web3/base/emitter'
import { multiChain } from '@lit-web3/chain/src'

import { getPreferences } from './base'

// Only save allowed keys
const toPrefer = (network: ChainNetwork | PreferNetwork) =>
  Object.fromEntries(Object.entries(network).filter((r) => ['id'].includes(r[0])))

export const defaults = <PreferNetworks>Object.fromEntries(
  Object.values(multiChain)
    .map((networks) => networks[0])
    .map((network) => [network.name, toPrefer(network)])
)

class NetworkStorage {
  constructor() {}
  // Read
  getAll = async (): Promise<PreferNetworks> => (await getPreferences()).state.networks ?? defaults
  get = async (chainName: ChainName): Promise<ChainNetwork> => {
    const _networks = await this.getAll()
    const chainNetworks = multiChain[chainName]
    const { id: savedId } = _networks[chainName] ?? chainNetworks[0]
    let network = chainNetworks.find((r) => r.id === savedId)
    if (!network) {
      network = chainNetworks[0]
      this.set({ [chainName]: toPrefer(network) } as PreferNetworks)
    }
    return network
  }

  // Write
  update = async (networks?: PreferNetworks) => {
    if (networks) {
      const { updateState } = await getPreferences()
      updateState({ networks })
    }
    this.emit(networks)
  }
  set = async (reqNetworks: PreferNetworks) => {
    const networks = await this.getAll()
    let chainName: ChainName
    for (chainName in reqNetworks) {
      Object.assign(networks[chainName], toPrefer(reqNetworks[chainName]))
    }
    this.update(networks)
  }
  reset = async () => {
    await this.update(defaults)
  }
  // Event
  emit = async (networks?: PreferNetworks) => {
    emitter.emit('network_change', networks ?? (await this.getAll()))
  }
}

export const networkStorage = new NetworkStorage()
