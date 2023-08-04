import backgroundMessenger from '~/lib.next/messenger/background'
import { getKeyring } from '~/lib.next/keyring'
import { ConnectsStorage } from '~/lib.next/background/storage/preferences'
import { DOIDBodyParser, getDOIDs, assignConnects, getMultiChainAddress } from '~/middlewares'

// Re-emit keyring events (emitted from ~/lib.next/keyring)
const evtMap: Record<string, string> = {
  lock: 'state_lock'
}
;['lock', 'keyring_update', 'connect_change'].forEach((evt) => {
  const mappedEvt = evtMap[evt] ?? evt
  backgroundMessenger.emitter.on(evt, () => {
    backgroundMessenger.send(mappedEvt)
  })
})

export const internal_isunlock: BackgroundService = {
  method: 'internal_isunlock',
  middlewares: [],
  fn: async ({ res }) => {
    res.body = (await getKeyring()).isUnlocked
    backgroundMessenger.log('is unlocked:', res.body)
  }
}

export const internal_isinitialized: BackgroundService = {
  method: 'internal_isinitialized',
  middlewares: [],
  fn: async ({ res }) => {
    res.body = (await getKeyring()).isInitialized
    backgroundMessenger.log('is initialized:', res.body)
  }
}

export const unlock: BackgroundService = {
  method: 'unlock',
  middlewares: [DOIDBodyParser()],
  fn: async ({ res, state }) => {
    res.body = (await getKeyring()).unlock(state.pwd)
  }
}

export const lock: BackgroundService = {
  method: 'lock',
  middlewares: [],
  fn: async ({ res }) => {
    res.body = (await getKeyring()).lock()
  }
}

export const internal_getMultiChainAddress: BackgroundService = {
  method: 'internal_getMultiChainAddress',
  middlewares: [getMultiChainAddress()],
  fn: async ({ res, state }) => {
    res.body = state.addresses
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

export const internal_getConnects: BackgroundService = {
  method: 'internal_getConnects',
  middlewares: [assignConnects],
  fn: async ({ res, state }) => {
    const { connects } = state
    res.body = { connects }
  }
}

export const internal_connects_set: BackgroundService = {
  method: 'internal_connects_set',
  middlewares: [],
  fn: async ({ req, res }) => {
    const { host, name, names } = req.body
    await ConnectsStorage.set(host, name ?? names)
    res.body = 'ok'
  }
}

export const internal_connects_select: BackgroundService = {
  method: 'internal_connects_select',
  middlewares: [],
  fn: async ({ req, res }) => {
    const { host, name } = req.body
    await ConnectsStorage.select(host, name)
    res.body = 'ok'
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
  middlewares: [],
  fn: async ({ req, res }) => {
    const { name, address } = req.body
    const keyring = await getKeyring()
    await keyring.selectDOID({ name, address })
    res.body = 'ok'
  }
}

export const internal_keyring_state: BackgroundService = {
  method: 'internal_keyring_state',
  middlewares: [getDOIDs],
  fn: async ({ res, state }) => {
    const { DOIDs, selectedDOID, isInitialized, isUnlocked } = state
    res.body = { DOIDs, selectedDOID, isInitialized, isUnlocked }
  }
}
