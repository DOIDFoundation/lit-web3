// Only allowed in background environment
import { KeyringController } from '@metamask/eth-keyring-controller'
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
  const keyring = await getKeyring()
  await keyring.submitPassword(pwd)
  return keyring.fullUpdate()
}
export const getAccounts = async () => (await getKeyring()).getAccounts()

class Keyring extends KeyringController {
  constructor(keyringOpts: Record<string, any>) {
    super(keyringOpts)
  }
  async createNewVaultAndRestore(DOIDName: string, password: string, encodedSeedPhrase: number[]) {
    if (!DOIDName || !password) return
    const seedPhraseAsBuffer = Buffer.from(encodedSeedPhrase)
    const vault = await super.createNewVaultAndRestore(password, seedPhraseAsBuffer)
    const [primaryKeyring] = super.getKeyringsByType(HardwareKeyringTypes.hdKeyTree)
    if (!primaryKeyring) throw new Error(`No ${HardwareKeyringTypes.hdKeyTree} found`)
    let addresses = await this.getAddresses()
    this.setOwner(addresses[0], DOIDName)
    return vault
  }
  async createNewVaultAndKeychain(password: string) {
    super.createNewVaultAndKeychain(password)
  }
  setOwner = async (address: string, DOIDName: string) => {
    const { DOIDs = <VaultOwner>{} } = await this.store.getState()
    DOIDs[DOIDName] = address // 1 address can be aliased to multiple DOIDs
    this.store.updateState({ DOIDs })
  }
  getAddresses = () => super.getAccounts()
  getAccounts = async () => (await this.store.getState()).DOIDs
}

let keyring: Keyring
let promise: any
export const getKeyring = async () => {
  if (keyring) return keyring
  if (!promise)
    promise = new Promise(async (resolve) => {
      keyring = new Keyring({
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
