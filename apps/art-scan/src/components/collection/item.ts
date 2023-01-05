import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  styleMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import { getColl } from '@/lib/query'
// Components
import '@lit-web3/dui/src/address'
// Style
import style from './item.css?inline'

@customElement('doid-collection')
export class CollectionDetail extends TailwindElement(style) {
  @property() DOID!: DOIDObject

  @state() item: any = { image: '' }
  @state() pending = false
  @state() err = ''
  @state() ts = 0

  get name() {
    return this.DOID.name
  }
  get token() {
    return this.DOID.token
  }
  get minter() {
    return this.token?.address ?? ''
  }
  get tokenID() {
    return this.token?.tokenID ?? ''
  }
  get sequence() {
    return this.token?.sequence ?? ''
  }
  get slugName() {
    return this.token?.slugName ?? ''
  }

  get empty() {
    return !this.pending && !!this.ts && !this.meta.name
  }
  get meta() {
    return this.item.meta || {}
  }
  get marketplace() {
    return this.item.marketplace || {}
  }

  async getCollection() {
    // TODO://get address after token split
    // TODO: SET EMPTY
    if (this.pending) return
    if (!this.slugName || !this.tokenID || !this.minter) return
    this.pending = true
    this.err = ''
    try {
      // input: slug, tokenId, minter, seq
      const collections = (await getColl(this.minter, this.slugName, this.tokenID, this.sequence)) as any[]
      this.item = collections[0] || []
      console.info(this.item)
    } catch (err: any) {
      this.err = err.message || err
    } finally {
      this.ts++
      this.pending = false
    }
  }
  async connectedCallback() {
    super.connectedCallback()
    await this.getCollection()
  }
  render() {
    return html`<div class="comp-collection">
      ${when(
        this.empty,
        () => html``,
        () =>
          html` ${when(
            this.pending,
            () => html`<i class="mdi mdi-loading"></i>`,
            () =>
              html`${when(
                !this.err,
                () => html`<div class="mt-4 grid grid-cols-1 lg_grid-cols-5 gap-4 lg_gap-8">
                  <div class="lg_col-span-2 flex flex-col gap-2 justify-center items-center p-4 lg_px-6 bg-gray-100">
                    <div
                      class="w-full h-80 lg_w-60 lg_h-60 lg_grow bg-white bg-center bg-no-repeat bg-cover"
                      style="${styleMap({ backgroundImage: `url(${this.meta.image_url})` })}"
                    ></div>
                    <div class="text-base mb-2">${this.meta.name}</div>
                    <div class="break-words break-all text-gray-500">${this.meta.description}</div>
                  </div>
                  <div class="mt-8 lg_mt-0 lg_col-span-3">
                    <div class="flex lg_flex-col gap-2 mb-2 text-xs lg_text-sm">
                      <span>Created by:</span>
                      <span class="text-gray-500">${this.name}</span>
                    </div>
                    <div class="flex lg_flex-col gap-2 mb-2 text-xs lg_text-sm">
                      <span>Owned by:</span>
                      <span class="text-gray-500">${this.item.owner?.id}</span>
                    </div>
                    <div class="flex lg_flex-col gap-2 mb-2 text-xs lg_text-sm">
                      <span>Marketplace:</span>
                      <a .href=${this.marketplace.url} class="text-blue-500" target="_blank"
                        >${this.marketplace.title}</a
                      >
                    </div>

                    <div class="mt-6 lg_mt-6">
                      <div class="text-base mb-3">Meta Info.</div>
                      <div class="flex flex-col gap-2">
                        <div class="flex gap-2 items-center text-xs lg_text-sm">
                          <span>Contract:</span>
                          <a .href=${this.item.contractUrl} class="lg_text-sm text-blue-500" target="_blank"
                            >${this.item.id}</a
                          >
                        </div>
                        <div class="flex gap-2  text-xs lg_text-sm">
                          <span>Token ID:</span>
                          <span class="text-gray-500">${this.item.tokenId}</span>
                        </div>
                        <div class="flex gap-2 items-center  text-xs lg_text-sm">
                          <span>Chain:</span>
                          <span><span class="text-gray-500">Ethereum</span><i class="mdi mdi-ethereum ml-1"></i></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`
              )}`
          )}`
      )}
    </div>`
  }
}
