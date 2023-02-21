import { State, property } from '@lit-app/state'
export { StateController } from '@lit-app/state'

class Store extends State {
  @property({ value: false }) pending!: boolean
  get key() {
    return ''
  }
}

export const walletStore = new Store()
