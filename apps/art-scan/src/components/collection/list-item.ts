import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  styleMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import { searchStore, StateController } from '@lit-web3/dui/src/ns-search/store'
import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
// Components
// Styles
import style from './list-item.css?inline'

@customElement('doid-coll-item')
export class CollectionList extends TailwindElement(style) {
  bindStore: any = new StateController(this, searchStore)
  @property({ type: Object }) item: any = {}
  @property() name = ''

  get CoinType() {
    return 'ETH'
  }
  get tokenId() {
    const _tokenId = this.item.tokenID ?? ''
    return _tokenId.length > 30 ? '' : `#${_tokenId}`
  }
  get createTime() {
    return new Date(1000 * this.item.createdAt).toLocaleString()
  }
  get wrapName() {
    return wrapTLD(this.name)
  }
  get ownerName() {
    return this.item.owner?.id
  }
  get title() {
    return `${this.wrapName} ${this.tokenId}`
  }

  get meta() {
    return this.item.meta
  }

  goto = () => {
    if (!this.tokenId) return
    // goto detail
  }
  render() {
    return html`<div class="item p-4 cursor-pointer" @click="${this.goto}">
      <div class="font-medium">${this.title}</div>
      <div class="flex gap-4 py-4">
        <div
          class="w-24 h-24 shrink-0 bg-white bg-center bg-no-repeat bg-cover"
          style=${styleMap({ backgroundImage: `url(${this.meta.image_url})` })}
        ></div>
        <div>
          <span class="text-base mb-2">${this.meta?.name}</span>
          <p class="break-words break-all text-xs">${this.meta.description}</p>
        </div>
      </div>
      <div class="text-xs">
        ${when(this.CoinType === 'ETH', () => html`<i class="mdi mdi-ethereum"></i>`)} Minted on ${this.createTime},
        Owned by ${this.ownerName}
      </div>
    </div> `
  }
}
