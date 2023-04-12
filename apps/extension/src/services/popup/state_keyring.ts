import backgroundMessenger from '~/lib.next/messenger/background'
import { getKeyringController, isInitialized, isUnlocked } from '~/lib.next/keyring'

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
  fn: async ({ res }) => {
    res.body = await isUnlocked()
    backgroundMessenger.log('is unlocked:', res.body)
  }
}

export const state_isinitialized: BackgroundService = {
  method: 'state_isinitialized',
  middlewares: [],
  fn: async ({ res }) => {
    res.body = await isInitialized()
    backgroundMessenger.log('is initialized:', res.body)
  }
}

export const unlock: BackgroundService = {
  method: 'unlock',
  middlewares: [],
  fn: async ({ res, req }) => {
    res.body = await (await getKeyringController()).submitPassword(req.raw.data)
  }
}

export const lock: BackgroundService = {
  method: 'lock',
  middlewares: [],
  fn: async ({ res }) => {
    res.body = await (await getKeyringController()).setLocked()
  }
}
