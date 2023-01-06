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
import '@lit-web3/dui/src/link'
// Style
import style from './item.css?inline'
import { getNetwork, getOpensea } from '@lit-web3/ethers/src/useBridge'

@customElement('doid-collection')
export class CollectionDetail extends TailwindElement(style) {
  @property() DOID?: DOIDObject
  @state() cooked: DOIDObject | undefined
  @state() item: Coll = {}
  @state() pending = false
  @state() err = ''
  @state() ts = 0

  get doid() {
    return this.DOID?.doid
  }
  get doidName() {
    return this.DOID?.name
  }
  get token() {
    return this.DOID?.token
  }
  get minter() {
    return this.token?.minter ?? ''
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
  @state() openseaUrl = ''
  @state() scanUrl = ''

  get empty() {
    return !this.pending && !!this.ts && !this.meta?.name
  }
  get meta() {
    return this.item.meta
  }

  async getCollection() {
    // TODO://get address after token split
    // TODO: SET EMPTY
    if (this.pending) return

    if (!(this.slugName || this.tokenID || this.minter)) return
    this.pending = true
    this.err = ''
    try {
      // input: slug, tokenId, minter, seq
      const collections = (await getColl(this)) as Coll
      this.item = collections || {}
    } catch (err: any) {
      this.err = err.message || err
    } finally {
      this.ts++
      this.pending = false
    }
  }
  getOpenseaUrl = async () => {
    const uri = await getOpensea()
    this.openseaUrl = this.item.openseaUri && uri ? `${uri}${this.item.openseaUri}` : ''
  }
  getScanUrl = async () => {
    const uri = (await getNetwork()).scan
    this.scanUrl = `${uri}/address/${this.item.address}`
  }

  async connectedCallback() {
    super.connectedCallback()
    await this.getCollection()
    await this.getOpenseaUrl()
    await this.getScanUrl()
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
                () => html`<div class="my-4 grid grid-cols-1 lg_grid-cols-5 gap-4 lg_gap-8">
                  <div
                    class="lg_col-span-2 flex flex-col gap-2 justify-center items-center p-4 lg_px-6 bg-gray-100 rounded-md"
                  >
                    <div
                      class="w-full h-80 lg_w-60 lg_h-60 lg_grow bg-white bg-center bg-no-repeat bg-cover"
                      style=${styleMap({ backgroundImage: `url(${this.meta?.image})` })}
                    ></div>
                    <div class="text-base mb-2">${this.meta?.name}</div>
                    <div class="break-words break-all text-gray-500">${this.meta?.description}</div>
                  </div>
                  <div class="py-2 lg_mt-0 lg_col-span-3">
                    <div class="flex lg_flex-col gap-2 mb-2">
                      <b>Created by:</b>
                      <span class="text-gray-500">${this.doid}</span>
                    </div>
                    <div class="flex lg_flex-col gap-2 mb-2">
                      <b>Owned by:</b>
                      <span class="text-gray-500">${this.item.owner}</span>
                    </div>
                    <div class="flex lg_flex-col gap-2 mb-2">
                      <b>Marketplace:</b>
                      <dui-link open href=${this.openseaUrl}
                        >${this.openseaUrl && new URL(this.openseaUrl).origin}</dui-link
                      >
                    </div>

                    <div class="mt-6 lg_mt-6">
                      <div class="text-base mb-3"><b>Meta Info.</b></div>
                      <div class="flex flex-col gap-2">
                        <div class="flex gap-2 items-center">
                          <span>Contract:</span>
                          <dui-address
                            href=${this.scanUrl}
                            class="lg_text-sm text-blue-500"
                            .address=${this.item.address}
                          ></dui-address>
                        </div>
                        <div class="flex gap-2  text-xs lg_text-sm">
                          <span>Token ID:</span>
                          <span class="text-gray-500">${this.item.tokenID}</span>
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
