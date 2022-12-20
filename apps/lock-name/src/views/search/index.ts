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
import { chk } from '@lit-web3/ethers/src/nsResolver/checker'
// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'
import '@/components/favorites/btn'

import style from './search.css'
@customElement('view-search')
export class ViewSearch extends TailwindElement(style) {
  bindStore: any = new StateController(this, searchStore)
  @property() keyword = ''
  @state() names: unknown[] = []
  @state() ts = 0

  get len() {
    return this.names.length
  }
  get empty() {
    return !!this.ts && !this.len
  }

  search = async (e?: CustomEvent) => {
    const keyword = e?.detail ?? this.keyword
    console.log(chk())
    const res = await searchStore.search(keyword)
    this.names = [keyword]
    this.ts++
    // this.goto(`/search/${keyword}`)
  }

  connectedCallback() {
    this.search()
    super.connectedCallback()
  }

  render() {
    return html`<div class="view-search">
      <div class="dui-container">
        <dui-ns-search .text=${this.keyword} @search=${this.search} placeholder="Search name or addresses">
          <span slot="label"></span>
          <span slot="msgd"></span>
        </dui-ns-search>
        <!-- Pending -->
        ${when(searchStore.pending, () => html`<i class="mdi mdi-loading"></i> Searching...`)}
        <!-- Empty -->
        ${when(this.empty, () => html`No Data`)}
        <!-- List -->
        ${repeat(
          this.names,
          (name) =>
            html`<div
              @click=${() => goto(`/name/${name}`)}
              class="flex justify-between items-center gap-4 border p-3 shadow-sm cursor-pointer hover_bg-gray-100 rounded-md"
            >
              <b>${name}</b>
              <div class="flex gap-4 items-center">
                <span class="text-green-500">Available</span>
                <doid-favorites-btn .name=${name}></doid-favorites-btn>
              </div>
            </div>`
        )}
      </div>
    </div>`
  }
}
