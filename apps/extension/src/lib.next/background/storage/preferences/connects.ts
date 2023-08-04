// deps: preferences/base.ts
import emitter from '@lit-web3/core/src/emitter'
import { getPreferences } from './base'

// key: host, value: names

export const ConnectsStorage = {
  // Reads
  getAll: async (): Promise<Connects> => (await getPreferences()).state.connects ?? {},
  get: async (host: string): Promise<ConnectedNames> => (await ConnectsStorage.getAll())[host]?.names ?? [],
  has: async (host: string, name = '') => (await ConnectsStorage.get(host)).includes(name),

  // Write to state
  update: async (connects?: Connects) => {
    if (connects) {
      const { updateState } = await getPreferences()
      updateState({ connects })
    }
    emitAccountsChange(connects)
  },
  // Overwrite([]) or Add(non-existing string) or Remove(existing string)
  set: async (host: string, data: string | string[]) => {
    if (!host || !data) return
    const connects = await ConnectsStorage.getAll()
    connects[host] ??= { names: [] }
    // Overwrite existing
    if (Array.isArray(data)) {
      connects[host].names = data
    } else if (typeof data === 'string') {
      const { names } = connects[host]
      const idx = names.findIndex((r) => r === data)
      // Add
      if (idx < 0) names.push(data)
      // Remove
      else names.splice(idx, 1)
    }
    ConnectsStorage.update(connects)
  },
  // Switch to selected name and force connect
  select: async (host: string, name: string) => {
    const connects = await ConnectsStorage.getAll()
    connects[host] ??= { names: [] }
    const { names } = connects[host]
    if (names.includes(name)) names.sort((r) => (r === name ? -1 : 1))
    else names.unshift(name)
    ConnectsStorage.update(connects)
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

const emitAccountsChange = async (connects?: Connects) => {
  emitter.emit('connect_change', connects ?? (await ConnectsStorage.getAll()))
}
