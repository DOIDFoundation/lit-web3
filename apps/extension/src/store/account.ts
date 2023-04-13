import { State, property } from '@lit-app/state'
import { nameInfo } from '@lit-web3/ethers/src/nsResolver'
export { StateController } from '@lit-app/state'

class AccountStore extends State {
  @property({ value: false }) pending!: boolean
  @property({ value: 0 }) ts!: number
  // @property({ value: [] }) accounts!: NameInfo[]
  @property({ value: String }) name!: string
  @property({ value: String }) mainAddress!: string
  @property({ value: String }) owner!: string
  @property({ value: false }) registered!: boolean
  @property({ value: false }) available!: boolean

  get empty() {
    return !this.pending && (!this.name || !this.mainAddress)
  }
  get account() {
    return { name: this.name, mainAddress: this.mainAddress, owner: this.owner }
  }

  search = async (keyword: string, mark = false) => {
    let res = null
    this.pending = true
    if (keyword) {
      const { name, owner, mainAddress, registered, available } = (await nameInfo(keyword)) as NameInfo
      if (mark) {
        this.name = name
        this.mainAddress = mainAddress || ''
        this.owner = owner ?? ''
        this.registered = registered ?? false
        this.available = available ?? false
      }
      res = { name, owner, mainAddress, registered, available }
    }
    this.ts++
    this.pending = false
    return res
  }
}

export const accountStore = new AccountStore()
