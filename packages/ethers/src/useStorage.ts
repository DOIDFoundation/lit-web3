import { getEnvKey } from './useBridge'

export const useStorage = async (name: string, store = localStorage) => {
  const get = async () => {
    const saved = store.getItem(await getEnvKey(name))
    if (saved) return JSON.parse(saved)
  }
  return {
    get,
    set: async (data: unknown, { merge = false } = {}) => {
      const key = await getEnvKey(name)
      if (merge) data = Object.assign((await get()) ?? {}, data)
      store.setItem(key, JSON.stringify(data))
    },
    remove: async () => store.removeItem(await getEnvKey(name))
  }
}
