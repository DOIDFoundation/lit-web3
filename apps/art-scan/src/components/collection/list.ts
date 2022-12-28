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
import { searchStore, StateController } from '@lit-web3/dui/src/ns-search/store'
import { queryCollectionsByOwner } from '@/lib/query'

// Components
import './list-item'

// Styles
import style from './list.css?inline'

@customElement('doid-collections')
export class CollectionList extends TailwindElement(style) {
  bindStore: any = new StateController(this, searchStore)
  @property() keyword = ''

  @state() pending = false
  @state() err = ''
  @state() ts = 0
  @state() collections: any[] = []

  get empty() {
    return this.collections.length == 0
  }

  search = async (keyword?: string) => {
    const _keyword = keyword ?? this.keyword
    if (_keyword) searchStore.search(_keyword)
  }
  async getCollections() {
    const minter = ''
    // TODO: get minter address from name query
    if (this.pending || !minter) return
    this.pending = true
    this.err = ''
    try {
      this.collections = await queryCollectionsByOwner(minter)
    } catch (err: any) {
      console.error(err.message)
      this.err = err.message || err
    } finally {
      this.ts++
      this.pending = false
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.getCollections()
  }
  render() {
    return html`<div class="doid-collections">
      ${when(
        !this.empty,
        () =>
          html`${when(
            this.pending,
            () => html`<i class="mdi mdi-loading mr-1"></i>Loading...`,
            () =>
              html`<div class="grid lg_grid-cols-2 gap-4">
                ${repeat(
                  this.collections,
                  (item: any) =>
                    html`${keyed(
                      item.name,
                      html`<div class="bg-gray-100 mb-1 break-words break-all">
                        <doid-coll-item .item=${item} .name=${this.keyword}></doid-coll-item>
                      </div>`
                    )}`
                )}
              </div>`
          )}`,
        () => html`No collection yet.`
      )}
    </div>`
  }
}
