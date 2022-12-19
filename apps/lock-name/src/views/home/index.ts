import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'
// Style
import style from './index.css'

@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  render() {
    return html`<div class="home">
      <div class="dui-container">
        <doid-symbol>
          <span slot="h1">Your Decentralized OpenID</span>
          <p slot="msg">Safer, faster and easier entrance to chains, contacts and dApps</p>
        </doid-symbol>
        <dui-ns-search placeholder="Search name or addresses">
          <span slot="label"></span>
          <span slot="msgd"></span>
        </dui-ns-search>
      </div>
    </div>`
  }
}
