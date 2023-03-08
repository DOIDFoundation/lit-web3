import { State, property } from '@lit-app/state'
import { nameInfo } from '@lit-web3/ethers/src/nsResolver'
export { StateController } from '@lit-app/state'

class AccountStore extends State {
  @property({ value: false }) pending!: boolean
  @property({ value: 0 }) ts!: number
  // @property({ value: [] }) accounts!: NameInfo[]
  @property({ value: String }) name!: string
  @property({ value: String }) mainAddress!: string

  get empty() {
    return !this.pending && (!this.name || !this.mainAddress)
  }
  get account() {
    return { name: this.name, mainAddress: this.mainAddress }
  }

  search = async (keyword: string) => {
    let res = null
    this.pending = true
    if (keyword) {
      const { name, owner, mainAddress } = (await nameInfo(keyword)) as NameInfo
      this.name = name
      this.mainAddress = mainAddress || ''
      res = { name, owner, mainAddress }
    }
    this.ts++
    this.pending = false
    return res
  }
}

export const accountStore = new AccountStore()
