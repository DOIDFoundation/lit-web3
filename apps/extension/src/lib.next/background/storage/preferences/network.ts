// deps: preferences/base.ts
import emitter from '@lit-web3/core/src/emitter'
import { ChainName, chainNetworks, getNetwork, SelectedChain } from '~/lib.next/chain'

import { getPreferences } from './base'

const getChain = (chainName: string) => chainNetworks[chainName as keyof typeof ChainName]

export const NetworkStorage = {
  get: async (chainName: keyof typeof ChainName = ChainName.ethereum) => {
    const {
      state: { selectedChain = <SelectedChain>{} }
    } = await getPreferences()
    // networks[0] as default
    for (let _chainName in chainNetworks) {
      if (!selectedChain[_chainName]) selectedChain[_chainName] = { id: getChain(_chainName)[0].id }
    }
    let selected = selectedChain[chainName]
    return getNetwork(chainName, selected.id)
  },
  setSelected: async (networkName: ChainName, network = chainNetworks[networkName]) => {
    const {
      state: { selectedChain }
    } = await getPreferences()
    selectedChain[networkName] = network
  }
}

// Initialize directly
getPreferences().then(() => {
  // Sync if keyring updated
  // emitter.on(`keyring_update`, (e: CustomEvent) => {
  //   NetworkStorage.sync(e.detail.DOIDs)
  // })
})
