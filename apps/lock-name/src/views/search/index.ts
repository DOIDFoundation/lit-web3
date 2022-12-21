import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  repeat
} from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { searchStore, StateController } from '@lit-web3/dui/src/ns-search/store'
import { check, nameInfo } from '@lit-web3/ethers/src/nsResolver'
// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'
import '@/components/favorites/btn'

import style from './search.css?inline'
@customElement('view-search')
export class ViewSearch extends TailwindElement(style) {
  bindStore: any = new StateController(this, searchStore)
  @property() keyword = ''

  search = async (keyword?: string) => {
    const _keyword = keyword ?? this.keyword
    if (_keyword) searchStore.search(_keyword)
  }

  connectedCallback() {
    this.search()
    super.connectedCallback()
  }
  onSearch(e: CustomEvent) {
    goto(`/search/${e.detail}`)
    this.keyword = e.detail
    this.search(e.detail)
  }
  goto(e: CustomEvent) {
    const { name, available } = searchStore.names[e.detail - 1]
    goto(`/name/${name}/${available ? 'register' : 'details'}`)
  }

  render() {
    return html`<div class="view-search">
      <div class="dui-container">
        <dui-ns-search .text=${this.keyword} @search=${this.onSearch} placeholder="Search name or addresses">
          <span slot="label"></span>
          <span slot="msgd"></span>
        </dui-ns-search>
        <!-- Pending -->
        ${when(searchStore.pending, () => html`<i class="mdi mdi-loading"></i> Searching...`)}
        <!-- Empty -->
        ${when(searchStore.empty, () => html`No Data`)}
        <!-- List -->
        ${repeat(
          searchStore.names,
          (item) =>
            html`<div
              @click=${this.goto}
              class="flex justify-between items-center gap-4 border p-3 shadow-sm cursor-pointer hover_bg-gray-100 rounded-md"
            >
              <b>${item.name}</b>
              <div class="flex gap-4 items-center">
                <span class="text-green-500">Available</span>
                <doid-favorites-btn .name=${item.name}></doid-favorites-btn>
              </div>
            </div>`
        )}
      </div>
    </div>`
  }
}
