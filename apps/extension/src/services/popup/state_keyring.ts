import backgroundMessenger from '~/lib.next/messenger/background'
import { isUnlocked } from '~/lib.next/keyring'

// Re-emit keyring events (emitted from ~/lib.next/keyring)
const evtMap: Record<string, string> = {
  lock: 'state_lock'
}
;['lock', 'keyring_update'].forEach((evt) => {
  const mappedEvt = evtMap[evt] ?? evt
  backgroundMessenger.emitter.on(evt, () => {
    backgroundMessenger.send(mappedEvt)
  })
})

export const state_isunlock: BackgroundService = {
  method: 'state_isunlock',
  middlewares: [],
  fn: async (ctx) => {
    ctx.res.body = await isUnlocked()
  }
}

export const state_account: BackgroundService = {
  method: 'state_account',
  middlewares: [],
  fn: async (ctx) => {
    ctx.res.body = await isUnlocked()
  }
}
