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
import { nameInfo } from '@lit-web3/ethers/src/nsResolver'
import { getColls } from '@/lib/query'

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
    return !this.pending && this.ts && !this.collections.length
  }

  search = async (keyword?: string) => {
    const _keyword = keyword ?? this.keyword
    if (_keyword) searchStore.search(_keyword)
  }
  async getCollections() {
    // get name
    const res = <NameInfo>await nameInfo(this.keyword)
    const minter = res.owner.toLowerCase()
    if (this.pending || !minter) return
    this.pending = true
    this.err = ''
    try {
      const collections = (await getColls(minter)) as any[]
      this.collections = collections || []
    } catch (err: any) {
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
        this.empty,
        // Empty
        () => html`No collection yet.`,
        () =>
          html` ${when(
            this.pending,
            // Loading
            () => html`<i class="mdi mdi-loading mr-1"></i>Loading...`,
            // List
            () => html`<div class="grid gap-4">
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
          )}`
      )}
    </div>`
  }
}
