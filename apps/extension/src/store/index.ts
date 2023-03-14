import { State, property } from '@lit-app/state'
export { StateController } from '@lit-app/state'
import pify from 'pify'

class Store extends State {
  @property({ value: false }) pending!: boolean
  @property() doidState: any
  @property() promisifiedBackground: any
  get key() {
    return ''
  }
  async setBackgroundConnection(backgroundConnection: any) {
    this.promisifiedBackground = pify(backgroundConnection as Record<string, any>)
  }
  setState(state: any) {
    this.doidState = state
  }
  async executeBackgroundAction(method: string, ...args: any) {
    try {
      return await this.promisifiedBackground?.[method](...args, (error: any) => {
        throw error
      })
    } catch (err: any) {
      throw err
    }
  }
  async createNewVaultAndKeychain(...args: any) {
    return await this.executeBackgroundAction('createNewVaultAndKeychain', ...args)
  }
  async submitPassword(...args: any) {
    return await this.executeBackgroundAction('submitPassword', ...args)
  }
  async verifySeedPhrase() {
    return await this.executeBackgroundAction('verifySeedPhrase', [])
  }
  async markPasswordForgotten() {
    return await this.executeBackgroundAction('markPasswordForgotten', [])
  }
  async unMarkPasswordForgotten() {
    return await this.executeBackgroundAction('unMarkPasswordForgotten', [])
  }
  async addNewAccount(...args: any) {
    return await this.executeBackgroundAction('addNewAccount', ...args)
  }
  async resetAccount() {
    return await this.executeBackgroundAction('resetAccount', [])
  }
  async createNewVaultAndRestore(...args: any) {
    return await this.executeBackgroundAction('createNewVaultAndRestore', ...args)
  }
}

export const walletStore = new Store()
