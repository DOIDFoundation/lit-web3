// Only allowed in background environment
import { KeyringController, KeyringControllerError } from '@metamask/eth-keyring-controller'
import emitter from '@lit-web3/core/src/emitter'
import { HardwareKeyringTypes } from '~/constants/keyring'
import browser from 'webextension-polyfill'
import { saveStateToStorage, loadStateFromStorage, storageKey } from '~/lib.next/background/storage/extStorage'
import { getAddress as getMultiChainAddress, AddressType } from '~/lib.next/keyring/phrase'
// import ipfsHelper from '~/lib.next/ipfsHelper'
import { toUtf8String } from 'ethers'

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
  get primaryKeyring() {
    return this.keyrings[0]
  }
  get DOIDs() {
    return this.isUnlocked ? this.state.DOIDs : {}
  }
  get selectedDOID() {
    return this.isUnlocked ? this.state.selectedDOID : {}
  }
  get selectedAddress() {
    return this.selectedDOID?.address
  }
  get selectedKeyring() {
    return this.keyrings.find((keyring: Keyring) => keyring.getAccounts().includes(this.selectedAddress))
  }
  get mnemonic() {
    return this.selectedKeyring?.opts.mnemonic
  }
  get phrase() {
    return toUtf8String(new Uint8Array(this.mnemonic))
  }
  getAddresses = async () => await super.getAccounts()

  // DOID methods
  setDOIDs = async (name: string, address: string) => {
    const DOID = { name, address }
    const { DOIDs = {}, selectedDOID = DOID } = this.state
    DOIDs[name] = DOID
    this.store.updateState({ DOIDs, selectedDOID })
    // write ipfs
    // TODO: do not use mnemonic as parameter
    // const cid = await ipfsHelper.updateJsonData({addresses}, name, { memo: this.phrase })
  }
  selectDOID = async (DOIDish: VaultDOID | string | any) => {
    const { name = DOIDish } = DOIDish
    const selectedDOID = this.DOIDs[name]
    if (!selectedDOID) throw new Error(`Identity for '${name} not found`)
    this.store.updateState({ selectedDOID })
  }
  lock = async () => await this.setLocked()
  unlock = async (pwd: string) => {
    await this.submitPassword(pwd)
    return this.fullUpdate()
  }

  // MultiChain
  getMultiChainAddress = (type?: AddressType) => getMultiChainAddress(this.phrase, type)

  // Overrides
  addNewAccount = async (name: string) => {
    if (!this.primaryKeyring) throw new Error(`No ${HardwareKeyringTypes.hdKeyTree} found`)
    const oldAddrs = await this.getAddresses()
    await super.addNewAccount(this.primaryKeyring)
    const newAddr = (await this.getAddresses()).find((addr: string) => !oldAddrs.has(addr))
    await this.setDOIDs(name, newAddr)
  }
  removeAccount = async (DOID: VaultDOID) => {
    let { DOIDs, selectedDOID } = this.state
    const { name, address } = DOID
    delete DOIDs[name]
    if (selectedDOID?.name === name) [selectedDOID] = Object.values(DOIDs)
    this.store.updateState({ DOIDs, selectedDOID })
    await super.removeAccount(address)
    // Destory
    const keyring = await this.getKeyringForAccount(address)
    const updatedKeyringAccounts = keyring ? await keyring.getAccounts() : {}
    if (updatedKeyringAccounts?.length === 0) keyring.destroy?.()
    return DOID
  }

  addDOID = async (name: string, mnemonic: Uint8Array | string | number[]) => {
    if (!name || !mnemonic) return
    if (typeof mnemonic !== 'string') mnemonic = new TextDecoder().decode(new Uint8Array(mnemonic))
    const keyring = await super.addNewKeyring('HD Key Tree', {
      mnemonic: mnemonic,
      numberOfAccounts: 1
    })

    const [firstAccount] = await keyring.getAccounts()

    if (!firstAccount) {
      throw new Error(KeyringControllerError.NoFirstAccount)
    }
    this.fullUpdate()
    this.setDOIDs(name, firstAccount)
  }

  async createNewVaultAndRestore(name: string, password: string, mnemonic: Uint8Array | string | number[]) {
    if (!name || !password || !mnemonic) return
    if (typeof mnemonic !== 'string') mnemonic = new TextDecoder().decode(new Uint8Array(mnemonic))
    const vault = await super.createNewVaultAndRestore(password, mnemonic)
    if (!this.primaryKeyring) throw new Error(`No ${HardwareKeyringTypes.hdKeyTree} found`)
    let addresses = await this.getAddresses()
    await this.setDOIDs(name, addresses[0])
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
  keyring.store.subscribe((state: any) => {
    saveStateToStorage(storageKey.keyring)(state)
    keyring.memStore.updateState(state)
  })
  // keyring memStore is not persistent
  keyring.memStore.subscribe(async (state: any) => {
    let addresses = []
    if (!state) return console.warn('[To be confirmed] keyring state is undefined', state)
    const { keyrings, encryptionKey: loginToken, encryptionSalt: loginSalt } = state
    if (!keyrings) return console.warn('[To be confirmed] keyring state.keyrings is undefined', state)
    // @ts-expect-error
    if (loginToken && loginSalt) await browser.storage.session.set({ loginToken, loginSalt })

    // TODO: Is this necessary for now?
    if (keyrings)
      addresses = keyrings.reduce((acc: any, { accounts: _addresses } = <any>{}) => acc.concat(_addresses), [])

    emitter.emit('keyring_update', addresses)
  })
})

export default getKeyring
