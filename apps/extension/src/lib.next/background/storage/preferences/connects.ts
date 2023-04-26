// deps: preferences/base.ts
import emitter from '@lit-web3/core/src/emitter'
import { getPreferences } from './base'

type Connection = {
  [origin: string]: true
}
type Connects = {
  [name: string]: Connection
}

export const ConnectsStorage = {
  getConnects: async () => (await getPreferences()).state.connects ?? {},
  update: async (connects: Connects, has: boolean, name: string, origin?: string) => {
    const { updateState } = await getPreferences()
    updateState({ connects })
    emitter.emit('connect_change', { name, origin, has })
  },
  get: async (name: string, origin?: string) => {
    const connects = await ConnectsStorage.getConnects()
    const connection = connects[name]
    return origin && connection ? connection[origin] : connection
  },
  has: async (origin: string): Promise<boolean> => {
    const connects = await ConnectsStorage.getConnects()
    return (Object.values(connects) as Connection[]).some((connection) => connection[origin])
  },
  set: async (name: string, origin: string) => {
    const connects = await ConnectsStorage.getConnects()
    connects[name] ?? (connects[name] = {})
    connects[name][origin] = true
    ConnectsStorage.update(connects, true, name, origin)
  },
  remove: async (name: string, origin?: string) => {
    const connects = await ConnectsStorage.getConnects()
    if (origin) delete connects[name]?.[origin]
    else delete connects[name]
    ConnectsStorage.update(connects, false, name, origin)
  },
  sync: async () => {}
}

// Sync
getPreferences().then(() => {
  // emitter.on(`keyring_update`, (e: CustomEvent) => {
  //   ConnectsStorage.sync(e.detail.DOIDs)
  // })
})
