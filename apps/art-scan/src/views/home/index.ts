import { ThemeElement, html, customElement } from '@lit-web3/dui/shared/theme-element'
import { goto } from '@lit-web3/router'
// Components
import '~/components/search-bar'
import '@lit-web3/dui/doid-symbol'

// Style
import style from './index.css?inline'
import logo from '~/assets/logo.svg'
@customElement('view-home')
export class ViewHome extends ThemeElement(style) {
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
          <search-bar
            placeholder="Search by DOID artist signature/artwork"
            label="DOID of artist or artwork"
          ></search-bar>
        </div>
      </div>
    </div>`
  }
}
