import { TailwindElement, html, customElement, property, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { searchStore, StateController } from '@lit-web3/dui/src/ns-search/store'
import { goto } from '@lit-web3/dui/src/shared/router'

// Components
import '@lit-web3/dui/src/ns-search/entire'
import '@/components/collection/list'
import '@/components/collection/item'
// Style
import style from './index.css?inline'

@customElement('view-collection')
export class ViewCollection extends TailwindElement(style) {
  bindStore: any = new StateController(this, searchStore)
  @property() keyword = ''
  @property() token = ''

  search = async (keyword?: string) => {
    const _keyword = keyword ?? this.keyword
    if (_keyword) searchStore.search(_keyword)
  }
  onSearch = (e: CustomEvent) => {
    goto(`/collection/${e.detail}`)
    this.keyword = e.detail
    this.search(e.detail)
  }
  connectedCallback() {
    this.search()
    super.connectedCallback()
  }
  render() {
    return html`<div class="view-collection">
      <div class="dui-container">
        <doid-search-entire .default=${this.keyword} @search=${this.onSearch} placeholder="DOID of artist or artwork">
          <span slot="label"></span>
          <span slot="msgd"></span>
        </doid-search-entire>
        ${when(
          this.token.length,
          () => html`<!-- collection -->
            <doid-collection
              .keyword=${this.keyword}
              .token=${this.token}
              .name=${searchStore.names}
            ></doid-collection>`,
          () => html`<!-- artist's collections -->
            <doid-collections class="aa" keyword=${this.keyword}> </doid-collections>`
        )}
      </div>
    </div>`
  }
}
