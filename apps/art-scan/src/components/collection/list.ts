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
import { getColls } from '@/lib/query'

// Components
import '@lit-web3/dui/src/loading/icon'
import './list-item'
import '@lit-web3/dui/src/pagination'
// Styles
import style from './list.css?inline'

@customElement('doid-collections')
export class CollectionList extends TailwindElement(style) {
  @property() DOID?: DOIDObject

  @state() pending = false
  @state() err = ''
  @state() ts = 0
  @state() collections: any[] = []
  @state() nomore = true
  // pagination
  @state() page = 1

  get doid() {
    return this.DOID?.doid
  }
  get empty() {
    return this.doid && !this.pending && this.ts && !this.collections.length
  }
  get pagination(): Pagination {
    return { page: this.page, pageSize: 3 }
  }

  async getCollections() {
    // get name
    const { owner = '' } = await nameInfo(this.doid)
    const minter = owner.toLowerCase()
    if (this.pending || !minter) return
    this.pending = true
    this.err = ''
    try {
      const collections = await getColls({ minter }, this.pagination)
      if (this.page) {
        this.nomore = collections.length < (this.pagination.pageSize || 1) ? true : false
      }
      this.collections = collections
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
      ${when(
        this.empty,
        // Empty
        () => html`No collection yet.`,
        () =>
          html` ${when(
            this.pending && !this.ts,
            // Loading
            () => html`<loading-icon></loading-icon>`,
            // List
            () => html`<div class="grid gap-4">
                ${repeat(
                  this.collections,
                  (item: any) =>
                    html`${keyed(
                      item,
                      html`<div class="bg-gray-100 mb-1 break-words break-all rounded-md">
                        <doid-coll-item .DOID=${this.DOID} .item=${item}></doid-coll-item>
                      </div>`
                    )}`
                )}
              </div>
              ${when(
                this.ts,
                () => html`<dui-pagination
                  .pending=${this.pending}
                  .all=${this.nomore}
                  page-size="1"
                  page=${this.page}
                  @loadmore=${this.loadmore}
                ></dui-pagination>`
              )} `
          )}`
      )}
    </div>`
  }
}
