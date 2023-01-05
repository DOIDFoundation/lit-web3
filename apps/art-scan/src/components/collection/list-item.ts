import {
  TailwindElement,
  html,
  customElement,
  property,
  styleMap,
  when,
  state
} from '@lit-web3/dui/src/shared/TailwindElement'
import DOIDParser from '@lit-web3/ethers/src/DOIDParser'
import { goto } from '@lit-web3/dui/src/shared/router'
import { normalizeUri } from '@lit-web3/core/src/uri'
// Components
import '@lit-web3/dui/src/address'
// Styles
import style from './list-item.css?inline'

@customElement('doid-coll-item')
export class CollectionList extends TailwindElement(style) {
  @property() DOID!: DOIDObject
  @property({ type: Object }) item: any = {}
  @state() cooked: any = {}

  get DOIDName() {
    return this.DOID.doid
  }
  get createTime() {
    return new Date(this.item.ctime).toLocaleString()
  }
  get meta() {
    return this.item.meta ?? {}
  }
  get token() {
    const { meta: { name = '' } = {}, tokenID, sequence } = this.item
    return { name, tokenID, sequence }
  }
  get cookedName() {
    return this.cooked.parsed?.val
  }
  get cookedUri() {
    return this.cooked.parsed?.uri
  }
  get backgroundImage() {
    return normalizeUri(this.meta.image_url || this.meta.image)
  }

  cook = async () => {
    this.cooked = await DOIDParser({ DOIDName: this.DOIDName, token: this.token })
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.cook()
  }

  goto = () => {
    if (this.cookedUri) goto(`/collection/${this.cookedUri}`)
  }

  render() {
    return html`<div class="item p-4 cursor-pointer">
      <div class="font-medium"><span @click="${this.goto}">${this.cookedName}</span></div>
      <div class="flex gap-4 py-4">
        <div
          class="w-24 h-24 shrink-0 bg-white bg-center bg-no-repeat bg-cover"
          style=${styleMap({ backgroundImage: `url(${this.backgroundImage})` })}
        ></div>
        <div>
          ${when(
            this.meta.name,
            () =>
              html`<div>
                <span class="text-base mb-2" @click="${this.goto}"
                  >${this.meta.name}<i class="mdi mdi-ethereum ml-1"></i
                ></span>
              </div>`
          )}

          <p class="break-words break-all text-xs lg_text-sm text-gray-500">${this.meta.description}</p>
        </div>
      </div>
      <div class="text-xs">
        Minted on ${this.createTime}, Owned by <dui-address class="ml-1" .address=${this.item.owner}></dui-address>
      </div>
    </div> `
  }
}
