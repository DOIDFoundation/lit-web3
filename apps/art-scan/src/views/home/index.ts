import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '@lit-web3/dui/src/ns-search/entire'
import '@lit-web3/dui/src/doid-symbol'

// Style
import style from './index.css?inline'
import logo from '@/assets/logo.svg'
@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  goto = (e: CustomEvent) => {
    const { token, uri, DOID } = e.detail
    if (token.name) goto(`/collection/${uri}`)
    else goto(`/artist/${DOID.doid}`)
  }
  render() {
    return html`<div class="home">
      <div class="dui-container">
        <doid-symbol icon=${logo}
          ><span slot="h1">ARTSCAN</span>
          <p slot="msg">Authentic art, with Web3 artist signature</p></doid-symbol
        >
        <div class="max-w-2xl mx-auto">
          <doid-search-entire @search=${this.goto} placeholder="Search by DOID artist signature/artwork">
            <span slot="label">DOID of artist or artwork</span>
          </doid-search-entire>
        </div>
      </div>
    </div>`
  }
}
