import pify from 'pify'

import { property, State } from '@lit-app/state'

export { StateController } from '@lit-app/state'
class Store extends State {
  @property({ value: false }) pending!: boolean
  @property() doidState: any
  @property() promisifiedBackground: any
  get key() {
    return ''
  }
  updateDOIDState(data: any) {
    console.log(data, 'state-----')
  }
  async setBackgroundConnection(backgroundConnection: any) {
    this.promisifiedBackground = pify(backgroundConnection as Record<string, any>)
    // backgroundConnection.onNotification((data: any) => {
    //   if (data.method === 'sendUpdate') {
    //     this.updateDOIDState(data.params[0])
    //   } else {
    //     throw new Error(`Internal JSON-RPC Notification Not Handled:\n\n ${JSON.stringify(data)}`)
    //   }
    //   console.log('update background')
    // })
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
    } finally {
      const state = await this.promisifiedBackground?.getState()
      this.setState(state)
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
  async setSeedPhraseBackedUp(...args: any) {
    return await this.executeBackgroundAction('setSeedPhraseBackedUp', ...args)
  }
  async setCompletedOnboarding() {
    return await this.executeBackgroundAction('completeOnboarding', [])
  }
}

export const walletStore = new Store()
