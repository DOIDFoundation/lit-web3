// deps: preferences/base.ts
import emitter from '@lit-web3/core/src/emitter'

import { getPreferences } from './base'

type Connection = {
  [origin: string]: 1
}
type Connects = {
  [name: string]: Connection
}

export const ConnectsStorage = {
  get: async (name: string, origin?: string) => {
    const {
      state: { connects = {} }
    } = await getPreferences()
    const connection = connects[name]
    return origin ? connection[origin] : connection
  },
  has: async (origin: string, address: string) => {},
  set: async (name: string, origin: string) => {
    const {
      state: { connects = <Connects>{} },
      updateState
    } = await getPreferences()
    connects[name] ?? (connects[name] = {})
    connects[name][origin] = 1
    updateState({ connects })
  },
  remove: async (name: string, origin?: string) => {
    const {
      state: { connects = {} },
      updateState
    } = await getPreferences()
    if (origin) delete connects[name]?.[origin]
    else delete connects[name]
    updateState({ connects })
  }
}

// Initialize directly
getPreferences().then(() => {
  // Sync if keyring updated
  // emitter.on(`keyring_update`, (e: CustomEvent) => {
  //   ConnectsStorage.sync(e.detail.DOIDs)
  // })
})
