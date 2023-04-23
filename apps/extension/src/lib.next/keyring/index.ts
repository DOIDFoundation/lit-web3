// Only allowed in background environment
import { KeyringController } from '@metamask/eth-keyring-controller'
import emitter from '@lit-web3/core/src/emitter'
import { HardwareKeyringTypes } from '~/constants/keyring'
import browser from 'webextension-polyfill'
import { saveStateToStorage, loadStateFromStorage, storageKey } from '~/lib.next/background/storage/extStorage'

class Keyring extends KeyringController {
  constructor(keyringOpts: Record<string, any>) {
    super(keyringOpts)
  }
  // Shortcuts
  get state() {
    return this.store.getState()
  }
  get memState() {
    return this.memStore.getState()
  }
  get isInitialized() {
    return Boolean(this.state.vault)
  }
  get isUnlocked() {
    return this.memState.isUnlocked
  }
  get DOIDs() {
    return this.state.DOIDs
  }
  get selectedDOID() {
    return this.state.selectedDOID
  }
  get selectedAddress() {
    return this.selectedDOID.address
  }
  lock = async () => await super.setLocked()
  unlock = async (pwd: string) => {
    await this.submitPassword(pwd)
    return this.fullUpdate()
  }
  getAddresses = async () => await super.getAccounts()

  // DOID methods
  setDOIDs = async (name: string, address: string) => {
    const DOID = { name, address }
    const { DOIDs = { [name]: DOID }, selectedDOID = DOID } = this.state
    this.store.updateState({ DOIDs, selectedDOID })
  }
  selectDOID = async (DOIDish: VaultDOID | string | any) => {
    const { name = DOIDish } = DOIDish
    const selectedDOID = this.getDOIDs()[name]
    if (!selectedDOID) throw new Error(`Identity for '${name} not found`)
    this.store.updateState({ selectedDOID })
  }

  // Overrides
  removeAccount = async (DOID: VaultDOID) => {
    let { DOIDs, selectedDOID } = this.state
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
