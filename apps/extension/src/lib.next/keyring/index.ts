// Only allowed in background environment
import { KeyringController } from '@metamask/eth-keyring-controller'
import { loadStateFromPersistence } from '~/lib.legacy/keyringController.setup/loadStateFromPersistence'
import emitter from '@lit-web3/core/src/emitter'

let keyringController: typeof KeyringController
let promise: any

export const getKeyringController = async () => {
  if (keyringController) return keyringController
  if (!promise) {
    promise = new Promise(async (resolve) => {
      keyringController = new KeyringController({
        initState: (await loadStateFromPersistence()).KeyringController,
        cacheEncryptionKey: true
      })
      resolve(keyringController)
    })
  }
  return await promise
}
// Initialize directly
getKeyringController().then(() => {
  // Re-emit keyring events
  ;['unlock', 'lock'].forEach((evt) => {
    keyringController.on(evt, () => emitter.emit(evt))
  })
  keyringController.memStore.subscribe(async (state: any) => {
    const { keyrings, encryptionKey: loginToken, encryptionSalt: loginSalt } = state
    await browser.storage.session.set({ loginToken, loginSalt })
    const addresses = keyrings.reduce((acc: any, { accounts } = <any>{}) => acc.concat(accounts), [])
    emitter.emit('keyring_update', addresses)
  })
})

export const getMemState = async () => (await getKeyringController()).memStore.getState()
export const getState = async () => (await getKeyringController()).store.getState()

export const isUnlocked = async () => (await getMemState()).isUnlocked
export const isInitialized = async () => Boolean((await getState()).vault)
