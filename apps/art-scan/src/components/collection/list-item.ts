import { TailwindElement, html, customElement, property, styleMap } from '@lit-web3/dui/src/shared/TailwindElement'
import { searchStore, StateController } from '@lit-web3/dui/src/ns-search/store'
import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
// Styles
import style from './list-item.css?inline'

@customElement('doid-coll-item')
export class CollectionList extends TailwindElement(style) {
  bindStore: any = new StateController(this, searchStore)
  @property({ type: Object }) item: any = {}
  @property() name = ''

  get tokenId() {
    const _tokenId = this.item.tokenId
    return _tokenId ? `#${_tokenId}` : ''
  }
  get tokenIdShow() {
    return this.tokenId ? `#${this.tokenId}` : ''
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
    return this.item.meta || {}
  }

  goto = () => {
    if (!this.tokenId) return
    // TODO: get slug
    goto(`/collection/${this.name}/${this.item.slug}_${this.tokenId}_${this.item.seq}`)
  }
  render() {
    return html`<div class="item p-4 cursor-pointer" @click="${this.goto}">
      <div class="font-medium">${this.title}</div>
      <div class="flex gap-4 py-4">
        <div
          class="w-24 h-24 shrink-0 bg-white bg-center bg-no-repeat bg-cover"
          style=${styleMap({ backgroundImage: `url(${this.meta.image})` })}
        ></div>
        <div>
          <span class="text-base mb-2">${this.meta?.name}<i class="mdi mdi-ethereum ml-1"></i></span>
          <p class="break-words break-all text-xs lg_text-sm text-gray-500">${this.meta.description}</p>
        </div>
      </div>
      <div class="text-xs">Minted on ${this.createTime}, Owned by ${this.ownerName}</div>
    </div> `
  }
}
