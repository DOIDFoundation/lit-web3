import AppRoot from '@lit-web3/dui/src/shared/AppRoot.ethers'
import { routes } from '@/router'
import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/network-warning'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/nav/footer'
import '@lit-web3/dui/src/nav/nav'
import '@lit-web3/dui/src/link'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  render() {
    return html`<network-warning></network-warning>
      <dui-header menuable>
        <div slot="logo"><a class="text-base lg_text-lg font-semibold" href="/">ARTSCAN</a></div>
        <div class="flex flex-col p-4 pt-0" slot="submenu">
          <dui-link class="w-full" href="/collection" nav>My Collections</dui-link>
        </div>
      </dui-header>
      <main class="dui-app-main">
        <slot></slot>
      </main>
      <dui-footer>
        <div slot="center">
          Powered by<dui-link class="ml-0.5 underline underline-offset-2" href="https://doid.tech">DOID</dui-link>
        </div>
        <div slot="right"></div>
      </dui-footer>`
  }
}

AppRoot({ routes })
