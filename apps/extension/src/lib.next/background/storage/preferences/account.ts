// deps: preferences/base.ts, keyring's events
// TODO: Is this necessary for now?  we've already stored DOIDs on KeyringController
// import { normalize as normalizeAddress } from '@metamask/eth-sig-util'
import emitter from '@lit-web3/core/src/emitter'

import { getPreferences } from './base'

// export const AccountStorage = {
//   getSelected: async (): Promise<VaultDOID> => {
//     const {
//       state: { selectedAddress }
//     } = await getPreferences()
//     return selectedAddress
//   },
//   setSelected(_address) {
//     const address = normalizeAddress(_address)

//     const { identities } = this.store.getState()
//     const selectedIdentity = identities[address]
//     if (!selectedIdentity) {
//       throw new Error(`Identity for '${address} not found`)
//     }

//     selectedIdentity.lastSelected = Date.now()
//     this.store.updateState({ identities, selectedAddress: address })
//   },
//   set: async (DOIDs: VaultDOIDs) => {
//     const { updateState } = await getPreferences()
//     updateState({ identities: AccountStorage.toIdentities(DOIDs) })
//   },
//   remove: async (DOID: VaultDOID) => {
//     const { name, address } = DOID
//     const {
//       state: { identities },
//       updateState
//     } = await getPreferences()
//     if (!identities[address]) throw new Error(`${name}/${address} can't be deleted cause it was not found`)
//     delete identities[address]
//     updateState({ identities });
//     if (name === this.getSelected().name) {
//       const [selected] = Object.keys(identities);
//       this.setSelectedAddress(selected);
//     }
//     return address;
//   },
//   // Add state from keyring
//   add: async (DOIDs: VaultDOIDs) => {
//     const { updateState } = await getPreferences()
//     updateState({ identities: AccountStorage.toIdentities(DOIDs) })
//   },
//   // Sync state from keyring
//   sync: async (DOIDs: VaultDOIDs) => {
//     const {
//       state: { identities = <Identities>{}, lostIdentities = <Identities>{} },
//       updateState
//     } = await getPreferences()
//     if (Object.keys(DOIDs).length === 0) throw new Error('Expected non-empty array of addresses. Error #11201')

//     const newlyLost: Identities = {}
//     for (let address in identities) {
//       const identity = identities[address]
//       if (DOIDs[identity.name]) continue
//       newlyLost[address] = identity
//       delete identities[address]
//     }
//     // Identities are no longer present.
//     for (let address in newlyLost) {
//       lostIdentities[address] = newlyLost[address] // store lost accounts
//     }
//     updateState({ identities, lostIdentities })
//     AccountStorage.add(DOIDs)
//     // If the selected account is no longer valid,
//     // select an arbitrary other account:
//     let selected = await AccountStorage.getSelected()
//     if (!AccountStorage.find(selected, DOIDs)) {
//       ;[selected] = Object.values(DOIDs)
//       AccountStorage.setSelected(selected)
//     }
//     return selected
//   },
//   // Utils
//   toIdentities(DOIDs: VaultDOIDs) {
//     return Object.fromEntries(Object.values(DOIDs).map(({ address, name }) => [address, name]))
//   },
//   toDOIDs(identities: Identities) {
//     return Object.fromEntries(Object.values(identities).map(({ address, name }) => [name, address]))
//   },
//   find(DOIDish: any, DOIDs: VaultDOIDs) {
//     const { name = DOIDish } = DOIDish
//     return Object.values(DOIDs).find((DOID) => DOID.name === name)
//   }
// }

// // Initialize directly
// getPreferences().then(() => {
//   // Sync if keyring updated
//   emitter.on(`keyring_update`, (e: CustomEvent) => {
//     AccountStorage.sync(e.detail.DOIDs)
//   })
// })
