import { KeyringController } from '@metamask/eth-keyring-controller'

import { loadStateFromPersistence } from '~/lib.legacy/keyringController.setup/loadStateFromPersistence'

let keyringController: typeof KeyringController
let promise: any

export const getKeyringController = async () => {
  if (keyringController) return keyringController
  if (!promise) {
    promise = new Promise(async (resolve) => {
      keyringController = new KeyringController({
        initState: await loadStateFromPersistence(),
        cacheEncryptionKey: true
      })
      resolve(keyringController)
    })
  }
  return await promise
}
