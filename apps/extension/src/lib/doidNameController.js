const ObservableStore = require('obs-store')

class DoidNameController extends EventEmitter {
  store = {}
  memStore = {}
  constructor(opts) {
    super()
    this.store = opts.store || {}
    this.memStore = new ObservableStore({})
  }
  bindName(name, address) {
    this.memStore[name] = address
  }
}

export default DoidNameController
