import { State, property } from '@lit-app/state'
export { StateController } from '@lit-app/state'
import { check, nameInfo } from '@lit-web3/ethers/src/nsResolver'
import { goto } from '../shared/router'

class SearchStore extends State {
  @property({ value: false }) pending!: boolean
  @property({ value: [] }) names!: NameInfo[]
  @property({ value: 0 }) ts!: number

  get len() {
    return this.names.length
  }
  get empty() {
    return !this.pending && !this.len
  }

  search = async (keyword: string) => {
    this.pending = true
    this.names = []
    const { address, name, error } = check(keyword)
    if (address) return goto(`/address/${address}`)
    if (!error) {
      const res = await nameInfo([name])
      this.names = [res[0]]
    }
    this.ts++
    this.pending = false
  }
}

export const searchStore = new SearchStore()
