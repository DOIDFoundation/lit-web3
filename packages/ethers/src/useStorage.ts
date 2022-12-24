import { getEnvKey } from './useBridge'

export const useStorage = async (name: string, store = localStorage, withoutEnv = false) => {
  const get = async () => {
    const itemKey = await getEnvKey(name, withoutEnv)
    const saved = store.getItem(itemKey)
    if (saved) return JSON.parse(saved)
  }
  let listener: EventListener = (e: Event) => {}
  return {
    get,
    set: async (data: unknown, { merge = false } = {}) => {
      const key = await getEnvKey(name, withoutEnv)
      if (merge) data = Object.assign((await get()) ?? {}, data)
      store.setItem(key, JSON.stringify(data))
    },
    remove: async () => store.removeItem(await getEnvKey(name, withoutEnv)),
    on: (fn: EventListener) => {
      if (listener != fn) listener = fn
      window.addEventListener('storage', listener)
    },
    off: () => {
      window.removeEventListener('storage', listener)
    }
  }
}
