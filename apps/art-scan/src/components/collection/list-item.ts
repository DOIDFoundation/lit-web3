import { TailwindElement, html, customElement, property, when, state } from '@lit-web3/dui/src/shared/TailwindElement'
import DOIDParser from '@lit-web3/ethers/src/DOIDParser'
import { goto } from '@lit-web3/dui/src/shared/router'
import { normalizeUri } from '@lit-web3/core/src/uri'
import { getMetaData } from '@lit-web3/ethers/src/metadata'
// Components
import '@lit-web3/dui/src/address'
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/img/loader'
// Styles
import style from './list-item.css?inline'

@customElement('doid-coll-item')
export class CollectionList extends TailwindElement(style) {
  @property() DOID?: DOIDObject
  @property({ type: Object }) item: any = {}
  @state() cooked: DOIDObject | undefined
  @state() meta: any = {}

  get doid() {
    return this.DOID?.doid
  }
  get createTime() {
    return new Date(this.item.ctime).toLocaleString()
  }
  get token() {
    const { tokenID, sequence } = this.item
    return { name: this.meta?.name, tokenID, sequence }
  }
  get cookedName() {
    return this.cooked?.parsed?.val
  }
  get cookedUri() {
    return this.cooked?.parsed?.uri
  }
  get backgroundImage() {
    return normalizeUri(this.meta.image_url || this.meta.image)
  }

  cook = async () => {
    this.cooked = await DOIDParser({ DOIDName: this.doid, token: this.token })
  }

  getMeta = async () => {
    this.meta = await getMetaData(normalizeUri(this.item.tokenURI))
  }
  async connectedCallback() {
    super.connectedCallback()
    await this.getMeta()
    this.cook()
  }

  goto = () => {
    if (this.cookedUri) goto(`/collection/${this.cookedUri}`)
  }

  render() {
    return html`${when(
      this.meta.name != this.doid,
      () => html`<div class="item p-4">
        <div class="font-medium">
          <dui-link class="uri" href=${`/collection/${this.cookedUri}`}>${this.meta.name}</dui-link>
        </div>
        <div class="flex gap-4 py-4">
          <img-loader class="shrink-0 w-24 h-24" src=${this.backgroundImage} loading="lazy"></img-loader>
          <div>
            <div>
              ${when(
                this.meta.name,
                () => html`<dui-link class="text-base mb-2" href=${`/collection/${this.cookedUri}`}
                  >${this.meta.name}<i class="mdi mdi-ethereum ml-1"></i
                ></dui-link>`
              )}
            </div>

            <p class="break-words break-all text-xs lg_text-sm text-gray-500">${this.meta.description}</p>
          </div>
        </div>
        <div class="text-xs">
          Minted on ${this.createTime}, Owned by <dui-address class="ml-1" .address=${this.item.owner}></dui-address>
        </div>
      </div>`
    )}`
  }
}
