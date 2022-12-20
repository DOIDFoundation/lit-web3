import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
import emitter from '@lit-web3/core/src/emitter'
// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'

import style from './home.css'
@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  goto = (e: CustomEvent) => {
    emitter.emit('router-goto', `/search/${e.detail}`)
  }
  render() {
    return html`<div class="home">
      <div class="dui-container">
        <doid-symbol>
          <span slot="h1">Your Decentralized OpenID</span>
          <p slot="msg">Safer, faster and easier entrance to chains, contacts and dApps</p>
        </doid-symbol>
        <div class="max-w-xl mx-auto">
          <dui-ns-search @search=${this.goto} placeholder="Search name or addresses">
            <span slot="label"></span>
            <span slot="msgd"></span>
          </dui-ns-search>
        </div>
      </div>
    </div>`
  }
}