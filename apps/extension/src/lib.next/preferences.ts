// MetaMask preferences
// src: metamask-extension/app/scripts/controllers/preferences.js
import { getKeyringController } from './keyring'
import { normalize as normalizeAddress } from '@metamask/eth-sig-util'

type Address = number | string
export const storedAddress = {
  get: async () => {
    const { store } = await getKeyringController()
    return store.getState().selectedAddress
  },
  set: async (_address: Address) => {
    const { store } = await getKeyringController()
    const address = normalizeAddress(_address)
    const { identities } = store.getState()
    const selectedIdentity = identities[address]
    if (!selectedIdentity) throw new Error(`Identity for '${address} not found`)
    selectedIdentity.lastSelected = Date.now()
    store.updateState({ identities, selectedAddress: address })
  },
  add: async (addresses: Address[]) => {
    const { store } = await getKeyringController()
    const { identities } = store.getState()
    addresses.forEach((address) => {
      if (identities[address]) return
      const identityCount = Object.keys(identities).length
      identities[address] = { name: `Account ${identityCount + 1}`, address }
    })
    store.updateState({ identities })
  },
  sync: async (addresses: Address[]) => {
    const { store } = await getKeyringController()
    if (!Array.isArray(addresses) || addresses.length === 0) {
      throw new Error('Expected non-empty array of addresses. Error #11201')
    }

    const { identities, lostIdentities } = store.getState()

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

    store.updateState({ identities, lostIdentities })
    storedAddress.add(addresses)

    // If the selected account is no longer valid,
    // select an arbitrary other account:
    let selectedAddress = await storedAddress.get()
    if (!addresses.includes(selectedAddress)) {
      ;[selectedAddress] = addresses
      storedAddress.set(selectedAddress)
    }
    return selectedAddress
  }
}
