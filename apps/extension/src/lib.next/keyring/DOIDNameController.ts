import { ObservableStore } from '@metamask/obs-store'

class DOIDNameController {
  store
  memStore
  DOIDNames: Record<string, string> = {}
  constructor(opts) {
    const initState = opts.initState || {}
    this.store = new ObservableStore(initState)
    this.memStore = new ObservableStore({
      names: {}
    })
    this.DOIDNames = {}
  }

  bindName(name: string, ETHAddress: string) {
    this.DOIDNames[name] = ETHAddress
    this._updateMemStore()
    this.persistDoidNames()
  }

  getAddressByName(name: string) {
    return this.DOIDNames[name]
  }

  clearNames() {
    this.DOIDNames = {}
    this._updateMemStore()
    this.persistDoidNames()
  }

  // setting memstore by this.DOIDNames
  _updateMemStore() {
    this.memStore.updateState({ names: this.DOIDNames })
  }

  // setting store by memStore
  persistDoidNames() {
    const names = this.memStore.getState().names
    this.store.updateState({ names: names })
    return true
  }
}

export default DOIDNameController
