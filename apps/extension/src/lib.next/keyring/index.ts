// Only allowed in background environment
import { KeyringController as MetaMaskKeyringController } from '@metamask/eth-keyring-controller'
import DOIDNameController from './DOIDNameController'
import emitter from '@lit-web3/core/src/emitter'
import { HardwareKeyringTypes } from '~/constants/keyring'
import browser from 'webextension-polyfill'
import { localStore, loadStateFromPersistence } from '~/lib.next/background/store/localStore'

export const getMemState = async () => (await getKeyringController()).memStore.getState()
export const getState = async () => (await getKeyringController()).store.getState()

export const isUnlocked = async () => (await getMemState()).isUnlocked
export const isInitialized = async () => Boolean((await getState()).vault)
export const lock = async () => await (await getKeyringController()).setLocked()
export const unlock = async (pwd: string) => {
  const keyringController = await getKeyringController()
  await keyringController.submitPassword(pwd)
  return keyringController.fullUpdate()
}
export const getAddress = async () => await (await getKeyringController()).setLocked()

type KeyringControllerArgs = Record<string, any>

class KeyringController extends MetaMaskKeyringController {
  DOIDs = {}
  constructor(keyringOpts: KeyringControllerArgs) {
    super(keyringOpts)
    this.DOID = new DOIDNameController(keyringOpts)
  }
  async createNewVaultAndRestore(DOIDName: string, password: string, encodedSeedPhrase: number[]) {
    if (!DOIDName || !password) return
    const seedPhraseAsBuffer = Buffer.from(encodedSeedPhrase)
    // preferencesController.setAddresses([])
    // permissionController.clearState()
    // accountTracker.clearAccounts()
    const vault = await super.createNewVaultAndRestore(password, seedPhraseAsBuffer)
    const [primaryKeyring] = super.getKeyringsByType(HardwareKeyringTypes.hdKeyTree)
    if (!primaryKeyring) throw new Error(`No ${HardwareKeyringTypes.hdKeyTree} found`)
    let accounts = await this.getAccounts()
    await this.addNewAccount(primaryKeyring)
    accounts = await this.getAccounts()
    console.log(accounts, 'accounts')
    this.DOID.bindName(DOIDName, accounts[0])
    //
    // this.preferencesController.setAddresses(accounts)
    // this.selectFirstIdentity()
    return vault
  }
}

let keyringController: KeyringController
let promise: any
export const getKeyringController = async () => {
  if (keyringController) return keyringController
  if (!promise)
    promise = new Promise(async (resolve) => {
      const initState = (await loadStateFromPersistence()).KeyringController
      keyringController = new KeyringController({ initState, cacheEncryptionKey: true })
      resolve(keyringController)
    })
  return await promise
}
// Initialize directly
getKeyringController().then(() => {
  // Re-emit keyring events
  ;['unlock', 'lock'].forEach((evt) => {
    keyringController.on(evt, () => emitter.emit(evt))
  })
  // keyring does not persist state to storage @10.x
  keyringController.store.subscribe(localStore.save('KeyringController'))
  // keyring memStore is not persistent
  keyringController.memStore.subscribe(async (state: any) => {
    if (!state) return console.warn('[To be confirmed] keyring state is undefined', state)
    const { keyrings, encryptionKey: loginToken, encryptionSalt: loginSalt } = state
    if (!keyrings) return console.warn('[To be confirmed] keyring state.keyrings is undefined', state)
    // @ts-expect-error
    await browser.storage.session.set({ loginToken, loginSalt })
    const addresses = keyrings.reduce((acc: any, { accounts } = <any>{}) => acc.concat(accounts), [])
    emitter.emit('keyring_update', addresses)
  })
})

export default getKeyringController
