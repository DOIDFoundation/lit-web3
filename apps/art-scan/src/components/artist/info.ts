import { TailwindElement, html, customElement, property, state, keyed } from '@lit-web3/dui/src/shared/TailwindElement'
import { nameInfo } from '@lit-web3/ethers/src/nsResolver'
import { queryHoldlNums } from '~/lib/query'
// Components
import '@lit-web3/dui/src/address'
// Styles
import style from './info.css?inline'

@customElement('artist-info')
export class ArtistInfo extends TailwindElement(style) {
  @property() DOID?: DOIDObject

  @state() info?: NameInfo
  @state() hodls?: any

  get doid() {
    return this.DOID?.doid
  }

  get owner() {
    return this.info?.owner ?? ''
  }

  getOwnerInfo = async () => {
    this.info = await nameInfo(this.doid)
  }
  getHodlInfo = async () => {
    this.hodls = (await queryHoldlNums(this.owner)) as any
  }
  async connectedCallback() {
    super.connectedCallback()
    await this.getOwnerInfo()
    await this.getHodlInfo()
  }
  render() {
    return html`${keyed(
      this.info,
      html`<div class="artist-info">
        <div class="text-base mb-2">${this.doid}</div>
        <div class="flex gap-2">
          <div><dui-address .address=${this.info?.owner} avatar short copy class="text-xs"></dui-address></div>
        </div>
        <div class="w-full flex gap-2 text-xs mt-3">
          <div>${this.hodls?.mintNum ?? '-'} <span class="text-gray-500">artworks</span>,</div>
          <span>${this.hodls?.ownerNum ?? '-'} <span class="text-gray-500">owners</span></span>
        </div>
      </div>`
    )}`
  }
}
