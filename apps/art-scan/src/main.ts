import AppRoot from '@lit-web3/dui/src/shared/AppRoot.ethers'
import { routes } from '@/router'
import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/network-warning'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/nav/footer'
import '@lit-web3/dui/src/nav/nav'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  render() {
    return html`<network-warning></network-warning>
      <dui-header menuable>
        <div slot="sublogo" class="flex items-center"></div>
        <dui-nav slot="center" menuable>
          <dui-link href="/" nav alias="/search">Home</dui-link>
          <dui-link href="/artist" nav>Artist</dui-link>
          <dui-link href="/collection" nav>Collection</dui-link>
        </dui-nav>
        <div class="flex flex-col p-4 pt-0" slot="submenu">
          <dui-link class="w-full" href="/collection" nav>My Collections</dui-link>
        </div>
      </dui-header>
      <main class="dui-app-main">
        <slot></slot>
      </main>
      <dui-footer>
        <div slot="right"></div>
      </dui-footer>`
  }
}

AppRoot({ routes })
