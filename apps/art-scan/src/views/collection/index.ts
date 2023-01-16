import { TailwindElement, html, customElement, property, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '@/components/search-bar'
import '@/components/collection/breadscrumb'
import '@/components/collection/list'
import '@/components/collection/item'
// Style
import style from './index.css?inline'

@customElement('view-collection')
export class ViewCollection extends TailwindElement(style) {
  @property() DOID?: DOIDObject

  get doid() {
    return this.DOID?.doid
  }
  get tokenName() {
    return this.DOID?.token?.name
  }
  get items() {
    const routes = []
    if (this.tokenName) routes.push({ name: this.doid, url: `/collection/${this.doid}` })
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
        <search-bar lite .default=${this.DOID?.uri} label="DOID of artist or artwork"></search-bar>
        <coll-breadcrumb .items=${this.items} class="mb-2"></coll-breadcrumb>
        ${when(
          this.tokenName,
          () => html`<!-- collection -->
            <doid-collection .DOID=${this.DOID}></doid-collection>`,
          () => html`<!-- artist's collections -->
            <doid-collections .DOID=${this.DOID}></doid-collections>`
        )}
      </div>
    </div>`
  }
}
