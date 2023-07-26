// deps: preferences/base.ts
import emitter from '@lit-web3/core/src/emitter'
import { getPreferences } from './base'
import { isEqual } from 'lodash'

// key: host, value: names

export const ConnectsStorage = {
  // Reads
  getAll: async (): Promise<Connects> => (await getPreferences()).state.connects ?? {},
  get: async (host: string): Promise<ConnectedNames> => (await ConnectsStorage.getAll())[host]?.names ?? [],
  has: async (host: string, name = '') => (await ConnectsStorage.get(host)).includes(name),

  // Writes
  update: async (connects?: Connects) => {
    if (connects) {
      const { state, updateState } = await getPreferences()
      if (isEqual(state.connects, connects)) return
      updateState({ connects })
    }
    emitAccountsChange()
  },
  set: async (host: string, names = []) => {
    if (!host) return
    const connects = await ConnectsStorage.getAll()
    connects[host] ??= { names: [] }
    connects[host].names = names
    ConnectsStorage.update(connects)
    emitter.emit('connect_change', connects)
  },
  remove: async (host: string, name: string) => {
    if (!ConnectsStorage.has(host, name)) return
    const connects = await ConnectsStorage.getAll()
    const { names } = connects[host]
    const idx = names.findIndex((r) => r === name)
    names.splice(idx, 1)
    ConnectsStorage.update(connects)
    emitter.emit('connect_change', connects)
  },
  // Sync with keyring
  sync: async () => {
    // TODO
    ConnectsStorage.update()
  }
}

// Sync
getPreferences().then(() => {
  emitter.on('keyring_update', (e: CustomEvent) => {
    ConnectsStorage.sync()
  })
})

const emitAccountsChange = async () => {
  emitter.emit('connect_change', await ConnectsStorage.getAll())
}
