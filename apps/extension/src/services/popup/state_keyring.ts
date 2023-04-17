import backgroundMessenger from '~/lib.next/messenger/background'
import * as keyring from '~/lib.next/keyring'
import { DOIDBodyParser } from '~/middlewares'
import { getAddress } from '~/lib.legacy/phrase'

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
    res.body = await keyring.isUnlocked()
    backgroundMessenger.log('is unlocked:', res.body)
  }
}

export const state_isinitialized: BackgroundService = {
  method: 'state_isinitialized',
  middlewares: [],
  fn: async ({ res }) => {
    res.body = await keyring.isInitialized()
    backgroundMessenger.log('is initialized:', res.body)
  }
}

export const unlock: BackgroundService = {
  method: 'unlock',
  middlewares: [DOIDBodyParser()],
  fn: async ({ res, state }) => {
    res.body = await keyring.unlock(state.pwd)
  }
}

export const lock: BackgroundService = {
  method: 'lock',
  middlewares: [],
  fn: async ({ res }) => {
    res.body = await keyring.lock()
  }
}

export const getAccounts: BackgroundService = {
  method: 'getAccounts',
  middlewares: [],
  fn: async ({ res }) => {
    const keyrings = (await keyring.getKeyringController()).keyrings
    if (keyrings.length === 0) throw new Error('no keyring')
    const mnemonic = new TextDecoder().decode(new Uint8Array((await keyrings[0].serialize()).mnemonic))
    res.body = await getAddress(mnemonic)
  }
}
