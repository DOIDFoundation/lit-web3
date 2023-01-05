import { TailwindElement, html, customElement, property, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '@lit-web3/dui/src/ns-search/entire'
import '@/components/collection/breadscrumb'
import '@/components/collection/list'
import '@/components/collection/item'
// Style
import style from './index.css?inline'

@customElement('view-collection')
export class ViewCollection extends TailwindElement(style) {
  @property() DOID!: DOIDObject

  get name() {
    return this.DOID.name
  }
  get uri() {
    return this.DOID.uri
  }
  get items() {
    const routes = []
    if (this.uri) routes.push({ name: this.name, url: `/collection/${this.name}` })
    if (routes.length) routes.push({ name: 'Collection' })
    return routes
  }

  onSearch = (e: CustomEvent) => {
    goto(`/collection/${e.detail.uri}`)
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`<div class="view-collection">
      <div class="dui-container">
        <doid-search-entire .default=${this.DOID.val} @search=${this.onSearch} placeholder="DOID of artist or artwork">
          <span slot="label"></span>
          <span slot="msg"></span>
        </doid-search-entire>
        <coll-breadcrumb .items=${this.items} class="mb-2"></coll-breadcrumb>
        ${when(
          this.uri,
          () => html`<!-- collection -->
            <doid-collection .DOID=${this.DOID}></doid-collection>`,
          () => html`<!-- artist's collections -->
            <doid-collections .DOID=${this.DOID}></doid-collections>`
        )}
      </div>
    </div>`
  }
}
