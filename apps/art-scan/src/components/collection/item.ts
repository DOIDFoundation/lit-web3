import { TailwindElement, html, customElement, property, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { getColl } from '~/lib/query'
import { getMetaData } from '@lit-web3/ethers/src/metadata'
// Components
import '@lit-web3/dui/src/address'
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/media-player'
import '@lit-web3/dui/src/loading/icon'
import '@lit-web3/dui/src/loading/skeleton'
import { getNetworkSync } from '@lit-web3/ethers/src/useBridge'
import { getScanUrl } from '@lit-web3/ethers/src/constants/openScan'
// Style
import style from './item.css?inline'

@customElement('doid-collection')
export class DoidCollection extends TailwindElement(style) {
  @property() DOID?: DOIDObject
  @state() cooked?: DOIDObject
  @state() item?: Coll
  @state() pending = false
  @state() metaPending = false
  @state() err = ''
  @state() ts = 0
  @state() meta?: Meta

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
  get slugName() {
    return this.token?.slugName ?? ''
  }
  get address() {
    return this.item?.address
  }
  get empty() {
    return !this.pending && !!this.ts && !this.metaPending && (!this.item || !this.sameURI)
  }
  get opensea() {
    const url = `${getScanUrl('opensea')}/${this.address}/${this.tokenID}`
    return { url, origin: new URL(url).origin }
  }
  get scan() {
    return `${getNetworkSync().scan}/address/${this.address}`
  }
  get sameURI() {
    const { slugURI } = this.item ?? {}
    return slugURI && this.DOID?.uri?.endsWith(slugURI)
  }

  async getCollection() {
    if (this.pending) return
    if (!(this.slugName || this.tokenID || this.minter)) return
    this.pending = true
    this.err = ''
    try {
      // input: slug, tokenId, minter, seq
      this.item = await getColl(this)
      this.getMeta()
    } catch (err: any) {
      this.err = err.message || err
    }
    this.ts++
    this.pending = false
  }
  getMeta = async () => {
    if (this.metaPending) return
    this.metaPending = true
    if (this.item) {
      try {
        this.meta = await getMetaData(this.item)
      } catch {
      } finally {
        this.metaPending = false
      }
    }
  }
  async connectedCallback() {
    super.connectedCallback()
    this.getCollection()
  }

  render() {
    return html`<div class="comp-collection">
      ${when(
        this.empty,
        () => html`<p class="text-center">No data yet.</p>`,
        () =>
          html` ${when(
            this.pending,
            () => html`<loading-icon type="block"></loading-icon>`,
            () =>
              html`${when(
                !this.err,
                () => html`<div class="my-4 grid grid-cols-1 lg_grid-cols-5 gap-4 lg_gap-8">
                  <div class="media lg_col-span-2 flex flex-col gap-2 items-center p-4 lg_px-6 bg-gray-100 rounded-md">
                    <dui-media-player autoplay class="w-full h-full" .meta=${this.meta}></dui-media-player>
                    <loading-skeleton class="flex flex-col items-center" .expect=${this.meta?.name} num="3"
                      ><div class="text-base mb-2">${this.meta?.name}</div>
                      <div class="break-words break-all text-gray-500">${this.meta?.description}</div></loading-skeleton
                    >
                  </div>
                  <div class="py-2 lg_mt-0 lg_col-span-3">
                    <div class="flex lg_flex-col gap-2 mb-2">
                      <b>Created by:</b>
                      <span class="text-gray-500">${this.doid}</span>
                    </div>
                    <div class="flex lg_flex-col gap-2 mb-2">
                      <b>Owned by:</b>
                      <span class="text-gray-500"
                        >${when(
                          this.item?.doids?.length,
                          () => html`${this.item?.doids?.at(0)?.name}`,
                          () => html`<dui-address .address=${this.item?.owner}></dui-address>`
                        )}</span
                      >
                    </div>
                    <div class="flex lg_flex-col gap-2 mb-2">
                      <b>Marketplace:</b>
                      <dui-link open href=${this.opensea.url}>${this.opensea.origin}</dui-link>
                    </div>

                    <div class="mt-6 lg_mt-6">
                      <div class="text-base mb-3"><b>Meta Info.</b></div>
                      <div class="flex flex-col gap-2">
                        <div class="flex gap-2 items-center">
                          <span>Contract:</span>
                          <dui-address
                            href=${this.scan}
                            class="lg_text-sm text-blue-500"
                            .address=${this.item?.address}
                          ></dui-address>
                        </div>
                        <div class="flex gap-2  text-xs lg_text-sm">
                          <span>Token ID:</span>
                          <span class="text-gray-500">${this.item?.tokenID}</span>
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
