// src: metamask-extension/app/scripts/lib/local-store.js
// `state` means `import { ObservableStore } from '@metamask/obs-store'`
import browser from 'webextension-polyfill'
import { checkForLastError } from '~/lib.next/utils.ext'
import { throttle } from '@lit-web3/ethers/src/utils'
import emitter from '@lit-web3/core/src/emitter'
import Migrator from './Migrator'

export enum storageKey {
  keyring = 'KeyringController',
  preferences = 'PreferencesController'
}

// Save ObservableStore to storage.local by key
export const saveStateToStorage = (key: storageKey) =>
  throttle(async (state: any) => {
    await extStorage.set({ ...(await extStorage.get()).data, [key]: state })
    emitter.emit(`state_${key.toString()}_persisted`, state)
  })

/**
 * A wrapper around the extension's storage local API
 */
export default class ExtStorage {
  isSupported: boolean
  dataPersistenceFailing: boolean
  metadata: any
  constructor() {
    this.isSupported = Boolean(browser.storage.local)
    if (!this.isSupported) console.debug('Storage local API not available.')
    this.dataPersistenceFailing = false
  }
  setMetadata(initMetaData: any) {
    this.metadata = initMetaData
  }
  save = saveStateToStorage

  // set all state
  async set(state: any) {
    if (!this.isSupported)
      throw new Error('[extStorage] cannot persist state to storage.local as this browser does not support this action')
    if (!state) throw new Error('[extStorage] updated state is missing')
    if (!this.metadata)
      throw new Error('[extStorage] metadata must be set on instance of ExtStorage before calling "set"')
    try {
      await this._set({ data: state, meta: this.metadata })
      if (this.dataPersistenceFailing) this.dataPersistenceFailing = false
    } catch (err) {
      if (!this.dataPersistenceFailing) this.dataPersistenceFailing = true
      console.debug('Setting state in storage.local:', err)
    }
  }
  _set = (obj: any) =>
    new Promise((resolve, reject) => {
      browser.storage.local.set(obj).then(() => {
        const err = checkForLastError()
        err ? reject(err) : resolve(true)
      })
    })

  // get all state
  async get() {
    if (!this.isSupported) return
    const result: any = await this._get()
    if (!Object.keys(result).length) return
    return result
  }
  _get = () =>
    new Promise((resolve, reject) => {
      browser.storage.local.get(null).then((result) => {
        const err = checkForLastError()
        err ? reject(err) : resolve(result)
      })
    })
}

export const extStorage = new ExtStorage()

export const initialState = {} // For initializing, not for saving
// Initialize, load all state from storage.local
export const loadStateFromStorage = async (key?: storageKey) => {
  const migrator = new Migrator()
  emitter.on('migrator_error', console.debug)
  // Read
  let versionedData: any = (await extStorage.get()) || migrator.generateInitialState(initialState)
  versionedData = await migrator.migrateData(versionedData)
  // meta
  extStorage.setMetadata(versionedData.meta)
  // Write
  extStorage.set(versionedData.data)
  return key ? versionedData.data[key] : versionedData.data
}
