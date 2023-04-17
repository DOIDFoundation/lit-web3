// User's Preferences (deps: KeyringController)
// src: metamask-extension/app/scripts/controllers/preferences.js
import { getKeyringController } from './keyring'
import { normalize as normalizeAddress } from '@metamask/eth-sig-util'
import { localStore, loadStateFromPersistence } from '~/lib.next/background/store/localStore'

type Address = number | string

let preferencesController: any
let promise: any
class PreferencesController {
  constructor() {}
}
export const preferences = new PreferencesController()
export const getPreferencesController = async () => {
  if (preferencesController) return preferencesController
  if (!promise)
    promise = new Promise(async (resolve) => {
      const initState = (await loadStateFromPersistence()).PreferencesController
      preferencesController = new PreferencesController()
      resolve(preferencesController)
    })
  return await promise
}

export const storedAddress = {
  get: async () => {
    const keyring = await getKeyringController()
    // const { store } = await getKeyringController()
    // console.log(await getKeyringController())
    // return store.getState().selectedAddress
    return keyring.getAccounts()
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
