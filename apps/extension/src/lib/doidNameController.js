import { ObservableStore } from '@metamask/obs-store'
import EventEmitter from 'events'

class DoidNameController extends EventEmitter {
  store = {}
  memStore = {}
  doidNames = {}
  constructor(opts) {
    super()

    const initState = opts.initState || {}
    this.store = new ObservableStore(initState)
    this.memStore = new ObservableStore({
      names: {}
    })
    this.doidNames = {}
  }

  bindName(name, address) {
    const names = this.memStore.getState().names
    names.set(name, address)
    this.doidNames.set(name, address)
    this._updateMemStore()
  }

  getAddressByName(name) {
    return this.doidNames.get(name)
  }

  clearNames() {
    this.doidNames = {}
    this._updateMemStore()
  }

  // setting memstore by this.doidNames
  _updateMemStore() {
    this.memStore.updateState({ names: this.names })
  }

  // setting
  persistDoidNames() {
    const names = this.memStore.getState().names
    this.store.updateState({ names: names })
    return true
  }
}

export default DoidNameController
