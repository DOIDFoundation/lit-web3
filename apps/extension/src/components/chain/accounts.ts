import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/address'
import popupMessenger from '~/lib.next/messenger/popup'

interface UserDetail {
  addresses: UserAddresses
}
type UserAddresses = Record<string, string>[]
const requestUserAddresses = async (name?: string): Promise<UserDetail> => {
  const accounts = await popupMessenger.send('internal_getMultiChainAddress', { name })
  return {
    addresses: [{ eth: accounts.eth }, { sol: accounts.solana }, { apt: accounts.aptos }, { bnb: accounts.eth }]
  }
}

@customElement('account-list')
export class accountList extends TailwindElement(null) {
  @property() name = ''
  @property() chain = null as any
  @property() class = ''
  @state() addresses: UserAddresses = []

  get mainAddress() {
    if (!this.chain?.coin) return ''
    const res = this.addresses.find((r) => Object.keys(r).indexOf(this.chain?.coin) > -1)
    return res ? res![this.chain?.coin] : ''
  }
  async connectedCallback() {
    const { addresses } = await requestUserAddresses()
    this.addresses = addresses
    super.connectedCallback()
  }

  render() {
    return html`<div class="flex flex-col justify-start items-start ${classMap(this.$c([this.class]))}">
      <strong class="mb-4">${this.chain?.title || this.chain?.name}</strong>
      <p class="text-xs text-gray-500 mb-1">Main address:</p>
      <dui-address .address=${this.mainAddress} copy></dui-address>
      <!-- <p class="text-xs text-gray-500 mt-4 mb-1">Other addresses:</p> -->
    </div>`
  }
}
