// User's Preferences storage (deps: KeyringController)
// src: metamask-extension/app/scripts/controllers/preferences.js
// import { getKeyring } from '~/lib.next/keyring'
// import { normalize as normalizeAddress } from '@metamask/eth-sig-util'
import emitter from '@lit-web3/core/src/emitter'
import { saveStateToStorage, storageKey, loadStateFromStorage } from '~/lib.next/background/storage/extStorage'
import { ObservableStore } from '@metamask/obs-store'

class PreferencesController {
  store
  constructor(initState: Record<string, any>) {
    this.store = new ObservableStore(initState)
  }
  // store proxy
  get state() {
    return this.store.getState()
  }
  updateState = (state: Record<string, any>) => {
    this.store.updateState(state)
  }
}

let preferences: PreferencesController
let promise: any
export const getPreferences = async () => {
  if (preferences) return preferences
  if (!promise)
    promise = new Promise(async (resolve) => {
      preferences = new PreferencesController((await loadStateFromStorage(storageKey.preferences)) || {})
      resolve(preferences)
    })
  await promise
  return preferences
}

// Initialize directly
getPreferences().then(() => {
  emitter.on(`state_${storageKey.preferences}_persisted`, () => {})
  preferences.store.subscribe(saveStateToStorage(storageKey.preferences))
})
