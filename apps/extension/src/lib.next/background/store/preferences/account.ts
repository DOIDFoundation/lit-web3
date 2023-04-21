// deps: preferences/base.ts
import { getKeyring } from '~/lib.next/keyring'
import { normalize as normalizeAddress } from '@metamask/eth-sig-util'
import emitter from '@lit-web3/core/src/emitter'

import { getPreferences } from './base'

export const storedAccount = {
  getSelectedAddress: async () => {
    const {
      state: { selectedAddress }
    } = await getPreferences()
    return selectedAddress
  },
  setAddresses: async (_address: Address) => {
    const address = normalizeAddress(_address)
    const {
      state: { identities },
      updateState
    } = await getPreferences()
    const selectedIdentity = identities[address]
    if (!selectedIdentity) throw new Error(`Identity for '${address} not found`)
    selectedIdentity.lastSelected = Date.now()
    updateState({ identities, selectedAddress: address })
  },
  // Add state from keyring
  addAddresses: async (addresses: Address[]) => {
    const {
      state: { identities },
      updateState
    } = await getPreferences()
    addresses.forEach((address) => {
      if (identities[address]) return
      const identityCount = Object.keys(identities).length
      identities[address] = { name: `Account ${identityCount + 1}`, address }
    })
    updateState({ identities })
  },
  // Sync state from keyring
  syncAddresses: async (addresses: Address[]) => {
    const {
      state: { identities = {}, lostIdentities = {} },
      updateState
    } = await getPreferences()
    if (addresses.length === 0) throw new Error('Expected non-empty array of addresses. Error #11201')

    const newlyLost: Record<string, any> = {}
    Object.keys(identities).forEach((identity) => {
      if (!addresses.includes(identity)) {
        newlyLost[identity] = identities[identity]
        delete identities[identity]
      }
    })

    // Identities are no longer present.
    if (Object.keys(newlyLost).length > 0) {
      // store lost accounts
      Object.keys(newlyLost).forEach((key) => {
        lostIdentities[key] = newlyLost[key]
      })
    }

    updateState({ identities, lostIdentities })
    storedAccount.addAddresses(addresses)

    // If the selected account is no longer valid,
    // select an arbitrary other account:
    let selectedAddress = await storedAccount.getSelectedAddress()
    if (!addresses.includes(selectedAddress)) {
      ;[selectedAddress] = addresses
      storedAccount.setAddresses(selectedAddress)
    }
    return selectedAddress
  }
}

// Initialize directly
getPreferences().then(() => {
  // Sync if keyring updated
  emitter.on(`keyring_update`, (e: CustomEvent) => {
    storedAccount.syncAddresses(e.detail)
  })
})
