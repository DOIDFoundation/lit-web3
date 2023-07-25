import { TailwindElement, html, customElement, property } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { searchStore, StateController } from '@lit-web3/dui/src/ns-search/store'
// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'
import '~/components/favorites/btn'
import '~/components/names/list'

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
        <dui-ns-search .default=${this.keyword} @search=${this.onSearch}></dui-ns-search>
        <!-- Names -->
        <doid-name-list
          .names=${searchStore.names}
          .pending=${searchStore.pending}
          .empty=${searchStore.empty}
        ></doid-name-list>
      </div>
    </div>`
  }
}
