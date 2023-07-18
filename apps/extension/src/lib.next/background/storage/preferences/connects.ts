// deps: preferences/base.ts
import emitter from '@lit-web3/core/src/emitter'
import { getPreferences } from './base'

type Connection = {
  [key: string]: true
}
type Connects = {
  [name: string]: Connection
}

// key: domain-chain, value: names

export const ConnectsStorage = {
  getConnects: async () => (await getPreferences()).state.connects ?? {},
  update: async (connects: Connects, has: boolean, name: string, origin?: string, chain?: string) => {
    const { updateState } = await getPreferences()
    updateState({ connects })
    emitter.emit('connect_change', { name, origin, has, chain })
  },
  get: async (key: string) => {
    const connects = await ConnectsStorage.getConnects()
    const connection = connects[key]
    const cur = connection.names.length ? connection.names[0] : ''
    return cur
  },
  has: async (key: string, name?: string): Promise<boolean> => {
    const connects = await ConnectsStorage.getConnects()
    const connect = connects[key]
    return name ? connect?.names?.includes(name) : connect
  },
  set: async (key: string, names: string) => {
    const connects = await ConnectsStorage.getConnects()
    const _names = names.split(',')
    connects[key] ?? (connects[key] = {})
    connects[key]['names'] = _names
    const [domain, chain] = key.split('-')
    ConnectsStorage.update(connects, true, names[0], domain, chain)
  },
  remove: async (key: string, name: string) => {
    const connects = await ConnectsStorage.getConnects()
    const names = connects[key]?.names
    const idx = names?.indexOf(name)
    if (idx < 0) return
    names.splice(idx, 1)
    const [domain, chain] = key.split('-')
    ConnectsStorage.update(connects, false, name, domain, chain)
  },
  sync: async () => {}
}

// Sync
getPreferences().then(() => {
  emitter.on('keyring_update', (e: CustomEvent) => {
    ConnectsStorage.sync()
  })
})
