import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  styleMap
} from '@lit-web3/dui/src/shared/TailwindElement'
// import { queryCollection } from '@/lib/query'
// Components
import './breadscrumb'
// Style
import style from './item.css?inline'

@customElement('doid-collection')
export class CollectionDetail extends TailwindElement(style) {
  @property() keyword = ''
  @property() token = ''

  @state() item: any = { image: '' }
  @state() pending = false
  @state() err = ''
  @state() ts = 0

  get tokenId() {
    const str = this.token.split('#')
    const tokenId = str[1]?.split('-')[0] || ''
    return tokenId ? `#${tokenId}` : ''
  }

  get items() {
    const routes = []
    if (this.keyword) routes.push({ name: this.keyword, url: `/collection/${this.keyword}` })
    // item name, tokenId
    if (this.token) routes.push({ name: this.token, url: `/collection/${this.keyword}/${this.token}` })
    return routes
  }

  getCollection = () => {
    if (this.pending) return
    this.pending = true
    this.err = ''
    try {
      // input:
      // this.item = queryCollection()
    } catch (err: any) {
      this.err = err.message || err
    } finally {
      this.ts++
      this.pending = false
    }
  }
  connectedCallback() {
    super.connectedCallback()
    this.getCollection()
  }
  render() {
    return html`<div class="comp-collection">
      <coll-breadcrumb .items=${this.items}></coll-breadcrumb>
      ${when(
        this.pending,
        () => html`<i class="mdi mdi-loading"></i>`,
        () =>
          html` ${when(
            !this.err,
            () => html`<div class="mt-4 flex flex-col lg_flex-row gap-4 lg_gap-8">
              <div class="lg_shrink-0 flex flex-col gap-2 justify-center items-center p-4 lg_px-6 bg-gray-200">
                <div
                  class="w-32 h-32 lg_w-60 lg_h-60 shrink-0 bg-white bg-center bg-no-repeat bg-cover"
                  style=${styleMap({ backgroundImage: `url(${this.item?.image})` })}
                ></div>
                <div class="text-base mb-2">Name of collection</div>
                <div>${this.item.description}</div>
              </div>
              <div class="grow">
                <div class="flex lg_flex-col gap-2 mb-2">
                  <span>Created by:</span>
                  <span class="text-gray-400">${this.keyword}</span>
                </div>
                <div class="flex lg_flex-col gap-2 mb-2">
                  <span>Owned by:</span>
                  <span class="text-gray-400">owner.doid</span>
                </div>
                <div class="flex lg_flex-col gap-2 mb-2">
                  <span>Marketplace:</span>
                  <span></span>
                </div>

                <div class="mt-6">
                  <div class="text-base mb-3">Meta Info.</div>
                  <div class="flex flex-col gap-2">
                    <div class="flex gap-2">
                      <span class="text-sm">Contract address:</span>
                      <span></span>
                    </div>
                    <div class="flex gap-2">
                      <span class="text-sm">Token ID:</span>
                      <span>${this.tokenId}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>`
          )}`
      )}
    </div>`
  }
}
