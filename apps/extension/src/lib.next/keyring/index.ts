// Only allowed in background environment
import { KeyringController as MetaMaskKeyringController } from '@metamask/eth-keyring-controller'
import DOIDNameController from './DOIDNameController'
import emitter from '@lit-web3/core/src/emitter'
import { HardwareKeyringTypes } from '~/constants/keyring'
import browser from 'webextension-polyfill'
import { saveStateToStorage, loadStateFromStorage, storageKey } from '~/lib.next/background/store/extStorage'

export const getMemState = async () => (await getKeyring()).memStore.getState()
export const getState = async () => (await getKeyring()).store.getState()

export const isUnlocked = async () => (await getMemState()).isUnlocked
export const isInitialized = async () => Boolean((await getState()).vault)
export const lock = async () => await (await getKeyring()).setLocked()
export const unlock = async (pwd: string) => {
  const keyringController = await getKeyring()
  await keyringController.submitPassword(pwd)
  return keyringController.fullUpdate()
}

class KeyringController extends MetaMaskKeyringController {
  DOIDs = {}
  constructor(keyringOpts: Record<string, any>) {
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
    // await this.addNewAccount(primaryKeyring)
    accounts = await this.getAccounts()
    console.log(accounts, 'accounts')
    this.DOID.bindName(DOIDName, accounts[0])
    //
    // this.preferencesController.setAddresses(accounts)
    // this.selectFirstIdentity()
    return vault
  }
}

let keyring: KeyringController
let promise: any
export const getKeyring = async () => {
  if (keyring) return keyring
  if (!promise)
    promise = new Promise(async (resolve) => {
      keyring = new KeyringController({
        initState: await loadStateFromStorage(storageKey.keyring),
        cacheEncryptionKey: true
      })
      resolve(keyring)
    })
  return await promise
}

// Initialize directly
getKeyring().then(() => {
  // Re-emit keyring events
  ;['unlock', 'lock'].forEach((evt) => {
    keyring.on(evt, () => emitter.emit(evt))
  })
  // keyring does not persist state to storage @10.x
  keyring.store.subscribe(saveStateToStorage(storageKey.keyring))
  // keyring memStore is not persistent
  keyring.memStore.subscribe(async (state: any) => {
    if (!state) return console.warn('[To be confirmed] keyring state is undefined', state)
    const { keyrings, encryptionKey: loginToken, encryptionSalt: loginSalt } = state
    if (!keyrings) return console.warn('[To be confirmed] keyring state.keyrings is undefined', state)
    // @ts-expect-error
    await browser.storage.session.set({ loginToken, loginSalt })
    const addresses = keyrings.reduce((acc: any, { accounts } = <any>{}) => acc.concat(accounts), [])
    emitter.emit('keyring_update', addresses)
  })
})

export default getKeyring
