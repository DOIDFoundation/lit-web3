import { TailwindElement, html, customElement, property, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { LazyElement } from '@lit-web3/dui/src/shared/LazyElement'
import DOIDParser from '@lit-web3/ethers/src/DOIDParser'
import { goto } from '@lit-web3/dui/src/shared/router'
import { getMetaData } from '@lit-web3/ethers/src/metadata'
// Components
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/media-player'
import '@lit-web3/dui/src/loading/skeleton'
// Styles
import style from './list-item.css?inline'

@customElement('doid-coll-item')
export class DoidCollItem extends LazyElement(TailwindElement(style)) {
  @property() DOID?: DOIDObject
  @property() item: Coll = {}
  @state() cooked?: DOIDObject
  @state() meta?: Meta

  get doid() {
    return this.DOID?.doid
  }
  get createTime() {
    return this.item.ctime ? new Date(this.item.ctime).toLocaleString() : ''
  }
  get token() {
    const { tokenID } = this.item
    return { name: this.meta?.name, tokenID }
  }
  get cookedName() {
    return this.cooked?.parsed?.val
  }
  get cookedUri() {
    return this.cooked?.parsed?.uri
  }
  get tokenName() {
    return this.cooked?.parsed?.val
  }

  cook = async () => {
    this.meta = await getMetaData(this.item)
    this.cooked = await DOIDParser({ DOIDName: this.doid, token: this.token })
  }

  override onObserved = () => {
    this.cook()
  }

  connectedCallback() {
    super.connectedCallback()
  }

  goto = () => {
    if (this.cookedUri) goto(`/collection/${this.cookedUri}`)
  }

  render() {
    return html`<div class="item p-4">
      <div class="font-medium">
        <loading-skeleton .expect=${this.meta?.name}
          ><dui-link class="uri" href=${`/collection/${this.cookedUri}`}>${this.cookedUri}</dui-link></loading-skeleton
        >
      </div>
      <div class="flex gap-4 py-4">
        <div class="shrink-0 w-24 h-24">
          <dui-media-player .meta=${this.meta}></dui-media-player>
        </div>
        <div>
          <loading-skeleton .expect=${this.meta?.name} num="3">
            <div class="mb-2 flex items-center">
              <dui-link class="text-base" href=${`/collection/${this.cookedUri}`}
                >${this.meta?.name}<i class="mdi mdi-ethereum ml-1"></i
              ></dui-link>
            </div>
            <p class="break-words break-all text-xs lg_text-sm text-gray-500">
              ${this.meta?.description}
            </p></loading-skeleton
          >
        </div>
      </div>
      <div class="text-xs">
        Minted on ${this.createTime}, Owned by
        ${when(
          this.item.doids?.length,
          () => html`${this.item.doids?.at(0)?.name}`,
          () => html`<dui-address .address=${this.item.owner}></dui-address>`
        )}
      </div>
    </div>`
  }
}
