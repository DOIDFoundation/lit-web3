import { ThemeElement, html, customElement } from '@lit-web3/dui/shared/theme-element'
import { goto } from '@lit-web3/router'
// Components
import '@lit-web3/dui/ns-search'
import '@lit-web3/dui/doid-symbol'

import style from './home.css?inline'
@customElement('view-home')
export class ViewHome extends ThemeElement(style) {
  goto = (e: CustomEvent) => {
    goto(`/search/${e.detail}`)
  }
  render() {
    return html`<div class="home">
      <p class="my-4 text-center">
        If you have locked a name with lockpass before, click&nbsp;<dui-link href="https://lockpass.doid.tech/passes"
          >here</dui-link
        >&nbsp;to redeem your DOID.
      </p>
      <div class="dui-container">
        <doid-symbol>
          <span slot="h1">Your Decentralized OpenID</span>
          <p slot="msg" class="my-2">Safer, faster and easier entrance to chains, contacts and dApps</p>
        </doid-symbol>
        <div class="max-w-xl mx-auto">
          <dui-ns-search @search=${this.goto} placeholder="Search DOID names"></dui-ns-search>
        </div>
      </div>
    </div>`
  }
}
