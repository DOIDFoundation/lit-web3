// Only allowed in background environment
import { KeyringController } from '@metamask/eth-keyring-controller'
import emitter from '@lit-web3/core/src/emitter'
import { HardwareKeyringTypes } from '~/constants/keyring'
import browser from 'webextension-polyfill'
import { saveStateToStorage, loadStateFromStorage, storageKey } from '~/lib.next/background/storage/extStorage'

// Shortcuts
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
export const getDOIDs = async () => (await getKeyring()).getDOIDs()
export const getSelected = async () => (await getState()).selectedDOID
export const getSelectedAddress = async () => (await getSelected()).address

class Keyring extends KeyringController {
  constructor(keyringOpts: Record<string, any>) {
    super(keyringOpts)
  }
  // DOID methods
  setDOIDs = async (name: string, address: string) => {
    const DOID = { name, address }
    const { DOIDs = { [name]: DOID }, selectedDOID = DOID } = this.store.getState()
    this.store.updateState({ DOIDs, selectedDOID })
  }
  setSelected = async (DOIDish: VaultDOID | string | any) => {
    const { name = DOIDish } = DOIDish
    const selectedDOID = this.getDOIDs()[name]
    if (!selectedDOID) throw new Error(`Identity for '${name} not found`)
    this.store.updateState({ selectedDOID })
  }
  getDOIDs = () => this.store.getState().DOIDs
  getAddresses = async () => await super.getAccounts()

  // Overrides
  removeAccount = async (DOID: VaultDOID) => {
    let { DOIDs, selectedDOID } = this.store.getState()
    const { name, address } = DOID
    delete DOIDs[name]
    if (selectedDOID?.name === name) [selectedDOID] = Object.values(DOIDs)
    this.store.updateState({ DOIDs, selectedDOID })
    await super.removeAccount(address)
    // Destory
    const keyring = await super.getKeyringForAccount(address)
    const updatedKeyringAccounts = keyring ? await keyring.getAccounts() : {}
    if (updatedKeyringAccounts?.length === 0) keyring.destroy?.()
    return DOID
  }

  async createNewVaultAndRestore(name: string, password: string, encodedSeedPhrase: number[]) {
    if (!name || !password) return
    const seedPhraseAsBuffer = Buffer.from(encodedSeedPhrase)
    const vault = await super.createNewVaultAndRestore(password, seedPhraseAsBuffer)
    const [primaryKeyring] = super.getKeyringsByType(HardwareKeyringTypes.hdKeyTree)
    if (!primaryKeyring) throw new Error(`No ${HardwareKeyringTypes.hdKeyTree} found`)
    let addresses = await this.getAddresses()
    this.setDOIDs(name, addresses[0])
    return vault
  }
  async createNewVaultAndKeychain(password: string) {
    let vault
    const addresses = await this.getAddresses()
    if (addresses.length) {
      vault = await this.fullUpdate()
    } else {
      vault = await super.createNewVaultAndKeychain(password)
      this.fullUpdate()
    }
    return vault
  }
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
    // TODO: Is this necessary for now?
    const addresses = keyrings.reduce((acc: any, { accounts: _addresses } = <any>{}) => acc.concat(_addresses), [])
    emitter.emit('keyring_update', addresses)
  })
})

export default getKeyring
