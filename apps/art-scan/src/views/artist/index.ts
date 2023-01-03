import { TailwindElement, html, customElement, property, when, keyed } from '@lit-web3/dui/src/shared/TailwindElement'
import { searchStore, StateController } from '@lit-web3/dui/src/ns-search/store'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '@lit-web3/dui/src/ns-search'
import '@/components/collection/list'
import '@/components/artist/info'
// Styles
import style from './index.css?inline'

@customElement('view-artist')
export class CollectionList extends TailwindElement(style) {
  bindStore: any = new StateController(this, searchStore)
  @property() name = ''

  search = async (name?: string) => {
    const _name = name ?? this.name
    if (_name) searchStore.search(_name)
  }
  onSearch = (e: CustomEvent) => {
    // TODO: diff name or collection
    goto(`/artist/${e.detail}`)
    this.name = e.detail
    this.search(e.detail)
  }

  connectedCallback() {
    super.connectedCallback()
  }
  render() {
    return html`<div class="view-artist">
      <div class="dui-container">
        <dui-ns-search .text=${this.name} @search=${this.onSearch} placeholder="DOID of artist or artwork">
          <span slot="label"></span>
          <span slot="msgd"></span>
        </dui-ns-search>
        ${when(
          this.name,
          () =>
            html`${keyed(
              this.name,
              html`<div class="grid grid-cols-1 lg_grid-cols-5 gap-4">
                <div class="order-2 lg_order-none lg_col-span-3">
                  <doid-collections keyword=${this.name}></doid-collections>
                </div>
                <div class="order-1 lg_order-none lg_col-start-5 lg_col-span-1 bg-gray-100 h-32 p-4">
                  <artist-info .name=${this.name}></artist-info>
                </div>
              </div>`
            )}`
        )}
      </div>
    </div>`
  }
}
