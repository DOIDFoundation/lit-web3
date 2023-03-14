import { ObservableStore } from './obs-store/ObservableStore'
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
    this.doidNames[name] = address
    this._updateMemStore()
    this.persistDoidNames()
  }

  getAddressByName(name) {
    return this.doidNames[name]
  }

  clearNames() {
    this.doidNames = {}
    this._updateMemStore()
    this.persistDoidNames()
  }

  // setting memstore by this.doidNames
  _updateMemStore() {
    this.memStore.updateState({ names: this.names })
  }

  // setting store by memStore
  persistDoidNames() {
    const names = this.memStore.getState().names
    this.store.updateState({ names: names })
    return true
  }
}

export default DoidNameController
