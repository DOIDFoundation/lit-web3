import { State, property } from '@lit-app/state'
export { StateController } from '@lit-app/state'
import pify from 'pify'

class Store extends State {
  @property({ value: false }) pending!: boolean
  @property() doidState = {}
  @property() promisifiedBackground: any
  get key() {
    return ''
  }
  async setBackgroundConnection(backgroundConnection: any) {
    this.promisifiedBackground = pify(backgroundConnection as Record<string, any>)
  }
}

export const walletStore = new Store()
