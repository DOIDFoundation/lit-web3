// deps: preferences/base.ts
import emitter from '@lit-web3/core/src/emitter'
import { ChainName, chainNetworks } from '~/lib.next/chain'
import type { Network, SelectedChain } from '~/lib.next/chain'

import { getPreferences } from './base'

const getChain = (chainName: string) => chainNetworks[chainName as keyof typeof ChainName]

export const NetworkStorage = {
  get: async (chainName?: keyof typeof ChainName) => {
    const {
      state: { selectedChain = <SelectedChain>{} }
    } = await getPreferences()
    // networks[0] as default
    for (let _chainName in chainNetworks) {
      if (!selectedChain[_chainName]) selectedChain[_chainName] = { id: getChain(_chainName)[0].id }
    }
    return chainName ? selectedChain[chainName] : selectedChain
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
