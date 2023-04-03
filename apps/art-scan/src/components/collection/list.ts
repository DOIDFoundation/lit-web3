import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  repeat,
  keyed
} from '@lit-web3/dui/src/shared/TailwindElement'
import { nameInfo } from '@lit-web3/ethers/src/nsResolver'
import { getColls } from '~/lib/query'

// Components
import '@lit-web3/dui/src/loading/icon'
import './list-item'
import '@lit-web3/dui/src/pagination'
// Styles
import style from './list.css?inline'

@customElement('doid-collections')
export class DoidCollections extends TailwindElement(style) {
  @property() DOID?: DOIDObject

  @state() pending = false
  @state() err = ''
  @state() ts = 0
  @state() collections: any[] = []
  @state() nomore = false
  // pagination
  @state() page = 1
  @state() pageSize = 5

  get doid() {
    return this.DOID?.doid
  }
  get empty() {
    return !this.err && !!this.doid && !!this.ts && !this.collections.length
  }
  get pagination(): Pagination {
    return { page: this.page, pageSize: this.pageSize }
  }

  async getCollections() {
    if (this.pending) return
    // get name
    const { owner: minter = '' } = await nameInfo(this.doid)
    if (!minter) return
    this.pending = true
    this.err = ''
    try {
      const collections = await getColls({ minter, doid: this.doid }, this.pagination)
      this.collections.push(...collections)
      this.nomore = collections.length < this.pageSize ? true : false
    } catch (err: any) {
      this.err = err.message || err
    } finally {
      this.ts++
      this.pending = false
    }
  }

  loadmore = () => {
    this.page++
    this.getCollections()
  }

  connectedCallback() {
    super.connectedCallback()
    this.getCollections()
  }
  render() {
    return html`<div class="doid-collections">
      ${when(this.err, () => html`${this.err}`)}
      <!-- List -->
      ${when(
        this.collections.length,
        () =>
          html`<div class="grid gap-4">
            ${repeat(
              this.collections,
              (item: Coll) =>
                html`${keyed(
                  item,
                  html`<div class="bg-gray-100 break-words break-all rounded-md">
                    <doid-coll-item .DOID=${this.DOID} .item=${item}></doid-coll-item>
                  </div>`
                )}`
            )}
          </div>`
      )}
      <!-- Pagination -->
      ${when(
        !this.err,
        () => html`<dui-pagination
          .pending=${this.pending}
          .nomore=${this.nomore}
          .firstLoad=${!this.ts}
          .empty=${this.empty}
          .pageSize=${this.pageSize}
          .page=${this.page}
          @loadmore=${this.loadmore}
          ><span slot="empty">No collection yet.</span></dui-pagination
        >`
      )}
    </div>`
  }
}
