import { State, property } from '@lit-app/state'
import { sleep } from '@lit-web3/ethers/src/utils'
import { useBridgeAsync } from '@lit-web3/ethers/src/useBridge'
export { StateController } from '@lit-app/state'

class SearchStore extends State {
  @property({ value: '' }) enterKey!: string
  @property({ value: false }) pending!: boolean
  @property({ value: null }) promise!: any

  get address(): string {
    return `${this.enterKey}`
  }

  get doidAddr(): string {
    return ''
  }
  async search(keyword: string) {
    if (this.pending) return this.promise
    this.pending = true
    this.promise = new Promise(async (resolve) => {
      const bridge = await useBridgeAsync()
      await sleep(1000)
      resolve({})
      this.pending = false
    })

    return await this.promise
  }
}

export const searchStore = new SearchStore()
