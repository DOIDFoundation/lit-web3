import browser from 'webextension-polyfill'
import { backgroundLogger } from '~/lib.next/logger'
import { checkForLastError } from '~/lib.next/utils.ext'
import { debounce } from '@lit-web3/ethers/src/utils'
import emitter from '@lit-web3/core/src/emitter'
import Migrator from './Migrator'

/**
 * A wrapper around the extension's storage local API
 */
export default class ExtensionStore {
  isSupported: boolean
  dataPersistenceFailing: boolean
  metadata: any
  constructor() {
    this.isSupported = Boolean(browser.storage.local)
    if (!this.isSupported) backgroundLogger('Storage local API not available.')
    this.dataPersistenceFailing = false
  }
  setMetadata(initMetaData: any) {
    this.metadata = initMetaData
  }

  save = (key: string) =>
    debounce((state: any) => {
      localStore.set({ [key]: state })
      emitter.emit(`${key}_persisted`, state)
    }, 1000)

  async set(state: any) {
    if (!this.isSupported)
      throw new Error('DOID - cannot persist state to local store as this browser does not support this action')
    if (!state) throw new Error('DOID - updated state is missing')
    if (!this.metadata)
      throw new Error('DOID - metadata must be set on instance of ExtensionStore before calling "set"')
    try {
      await this._set({ data: state, meta: this.metadata })
      if (this.dataPersistenceFailing) this.dataPersistenceFailing = false
    } catch (err) {
      if (!this.dataPersistenceFailing) this.dataPersistenceFailing = true
      backgroundLogger('Setting state in local store:', err)
    }
  }

  async get() {
    if (!this.isSupported) return
    const result = await this._get()
    if (isEmpty(result)) return
    return result
  }

  _get = () =>
    new Promise((resolve, reject) => {
      browser.storage.local.get(null).then((result) => {
        const err = checkForLastError()
        err ? reject(err) : resolve(result)
      })
    })

  _set = (obj: any) =>
    new Promise((resolve, reject) => {
      browser.storage.local.set(obj).then(() => {
        const err = checkForLastError()
        err ? reject(err) : resolve(true)
      })
    })
}

const isEmpty = (obj: any) => !Object.keys(obj).length

export const localStore = new ExtensionStore()

// Initialize
export const initialState = {
  config: {}
}
export const loadStateFromPersistence = async () => {
  const migrator = new Migrator()
  emitter.on('migrator_error', backgroundLogger)
  // Read
  let versionedData: any = (await localStore.get()) || migrator.generateInitialState(initialState)
  versionedData = await migrator.migrateData(versionedData)

  localStore.setMetadata(versionedData.meta)
  // Write
  localStore.set(versionedData.data)
  return versionedData.data
}
