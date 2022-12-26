import { State, property } from '@lit-app/state'
export { StateController } from '@lit-app/state'
import { checkDOIDName, nameInfo } from '@lit-web3/ethers/src/nsResolver'
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
    const { address, name } = checkDOIDName(keyword, { allowAddress: true })
    if (address) return goto(`/address/${address}`)
    if (name) {
      const res = (await nameInfo([name])) as NameInfo[]
      this.names = [res[0]]
    }
    this.ts++
    this.pending = false
  }
}

export const searchStore = new SearchStore()
