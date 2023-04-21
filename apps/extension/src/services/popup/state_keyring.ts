import backgroundMessenger from '~/lib.next/messenger/background'
import * as keyringCtrl from '~/lib.next/keyring'
import { getKeyring } from '~/lib.next/keyring'
import { DOIDBodyParser, getDOIDs } from '~/middlewares'
import { getAddress } from '~/lib.next/keyring/phrase'

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
    res.body = await keyringCtrl.isUnlocked()
    backgroundMessenger.log('is unlocked:', res.body)
  }
}

export const state_isinitialized: BackgroundService = {
  method: 'state_isinitialized',
  middlewares: [],
  fn: async ({ res }) => {
    res.body = await keyringCtrl.isInitialized()
    backgroundMessenger.log('is initialized:', res.body)
  }
}

export const unlock: BackgroundService = {
  method: 'unlock',
  middlewares: [DOIDBodyParser()],
  fn: async ({ res, state }) => {
    res.body = await keyringCtrl.unlock(state.pwd)
  }
}

export const lock: BackgroundService = {
  method: 'lock',
  middlewares: [],
  fn: async ({ res }) => {
    res.body = await keyringCtrl.lock()
  }
}

export const getAccounts: BackgroundService = {
  method: 'getAccounts',
  middlewares: [],
  fn: async ({ res }) => {
    const keyrings = (await getKeyring()).keyrings
    if (keyrings.length === 0) throw new Error('no keyring')
    const mnemonic = new TextDecoder().decode(new Uint8Array((await keyrings[0].serialize()).mnemonic))
    res.body = await getAddress(mnemonic)
  }
}

export const internal_getDOIDs: BackgroundService = {
  method: 'internal_getDOIDs',
  middlewares: [getDOIDs],
  fn: async ({ res, state }) => {
    const { DOIDs, selectedDOID } = state
    res.body = { DOIDs, selectedDOID }
  }
}

export const internal_getSelected: BackgroundService = {
  method: 'internal_getSelected',
  middlewares: [getDOIDs],
  fn: async ({ res, state }) => {
    const { selectedDOID } = state
    res.body = selectedDOID
  }
}

export const internal_selectDOID: BackgroundService = {
  method: 'internal_selectDOID',
  middlewares: [getDOIDs],
  fn: async ({ req, res }) => {
    const keyring = await getKeyring()
    const { name, address } = req.body
    await keyring.setSelected({ name, address })
    res.body = 'ok'
  }
}
