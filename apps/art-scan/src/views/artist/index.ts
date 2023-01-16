import { TailwindElement, html, customElement, property, when, keyed } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '@/components/search-bar'
import '@/components/collection/list'
import '@/components/artist/info'
// Styles
import style from './index.css?inline'

@customElement('view-artist')
export class CollectionList extends TailwindElement(style) {
  @property() DOID?: DOIDObject

  get doid() {
    return this.DOID?.doid
  }

  onSearch = (e: CustomEvent) => {
    const { token, uri, name } = e.detail
    if (token.name) goto(`/collection/${uri}`)
    else goto(`/artist/${name}`)
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`<div class="view-artist">
      <div class="dui-container">
        <search-bar lite .default=${this.DOID?.uri} label="DOID of artist or artwork"></search-bar>
        ${when(
          this.doid,
          () =>
            html`${keyed(
              this.doid,
              html`<div class="grid grid-cols-1 lg_grid-cols-5 gap-4">
                <div class="order-2 lg_order-none lg_col-span-3">
                  <doid-collections .DOID=${this.DOID}></doid-collections>
                </div>
                <div class="order-1 lg_order-none lg_col-start-5 lg_col-span-1 bg-gray-100 h-32 p-4">
                  <artist-info .DOID=${this.DOID}></artist-info>
                </div>
              </div>`
            )}`
        )}
      </div>
    </div>`
  }
}
