import AppRoot from '@lit-web3/dui/src/shared/AppRoot.ethers'
import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
import { routes } from '@/router'

// Components
import '@lit-web3/dui/src/network-warning'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/nav/nav'
import '@lit-web3/dui/src/nav/footer'
import '@lit-web3/dui/src/connect-wallet/btn'
// Style

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  render() {
    return html`<network-warning></network-warning>
      <dui-header>
        <dui-nav slot="left">
          <dui-link href="/" nav>NS</dui-link>
        </dui-nav>
        <connect-wallet-btn slot="wallet" dropable></connect-wallet-btn>
      </dui-header>
      <main class="dui-app-main">
        <slot></slot>
      </main>
      <dui-footer></dui-footer>`
  }
}

AppRoot({ routes })
