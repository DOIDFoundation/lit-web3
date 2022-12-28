import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'

// Style
import style from './index.css?inline'

@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  goto = (e: CustomEvent) => {
    goto(`/collection/${e.detail}`)
  }
  render() {
    return html`<div class="home">
      <div class="dui-container">
        <doid-symbol
          ><span slot="h1">ART SCAN</span>
          <p slot="msg">Web3 art authentication tool</p></doid-symbol
        >
        <dui-ns-search @search=${this.goto} placeholder="DOID of artist or artwork">
          <span slot="label">DOID of artist or artwork</span>
        </dui-ns-search>
      </div>
    </div>`
  }
}
