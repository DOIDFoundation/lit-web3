import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import { getAccount } from '~/lib.legacy/account'

// Components
import '@lit-web3/dui/src/address'

interface UserDetail {
  addresses: UserAddresses
}
type UserAddresses = Record<string, string>[]
const requestUserAddresses = async (): Promise<UserDetail> => {
  await 0
  return {
    addresses: [
      { eth: '0xcd87b53363031a4411c2c2bca41f77bde02ff87d' },
      { sol: '8XpocjZodGQiFdoh2P33EXF1dDCJErx5nAsnz81sK4wy' },
      { apt: '0x7df5715b2ce06f421f74dea324a87c8ea301281dccbdeecbc40d12810c1efcfb' },
      { bsc: '0xE9AE3261a475a27Bb1028f140bc2a7c843318afD' },
      { btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' }
    ]
  }
}

@customElement('account-list')
export class accountList extends TailwindElement(null) {
  @property() class = ''
  @property() chain = null as any
  @state() addresses: UserAddresses = []

  get account() {
    return getAccount()
  }

  get mainAddress() {
    if (!this.chain?.coin) return ''
    const res = this.addresses.find((r) => Object.keys(r).indexOf(this.chain.coin) > -1)
    return res![this.chain?.coin]
  }
  async connectedCallback() {
    const { addresses } = await requestUserAddresses()
    this.addresses = addresses
    super.connectedCallback()
  }

  render() {
    return html`<div class="flex flex-col justify-start items-start ${classMap(this.$c([this.class]))}">
      <div class="mb-4">${this.chain?.title || this.chain?.name} Adresses:</div>
      <p class="text-xs text-gray-500 mb-1">Main address:</p>
      <dui-address .address=${this.mainAddress} copy class="gap-2"></dui-address>
      <p class="text-xs text-gray-500 mt-4 mb-1">Other address:</p>
    </div>`
  }
}
