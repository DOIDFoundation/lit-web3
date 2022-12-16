import AppRoot from '@lit-web3/dui/src/shared/AppRoot.ethers'
import { routes } from '@/router'
import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/network-warning'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/nav/nav'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  render() {
    return html`<network-warning></network-warning>
      <dui-header>
        <div slot="sublogo" class="flex items-center"><a href="/">ART SCAN</a></div>
        <dui-nav slot="center">
          <dui-link href="/collections" nav>Collections</dui-link>
        </dui-nav>
      </dui-header>
      <main class="dui-app-main">
        <slot></slot>
      </main>`
  }
}

AppRoot({ routes })
