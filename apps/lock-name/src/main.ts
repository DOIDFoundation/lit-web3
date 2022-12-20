import AppRoot from '@lit-web3/dui/src/shared/AppRoot.ethers'
import { TailwindElement, html, customElement, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { routes } from '@/router'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'

// Components
import '@lit-web3/dui/src/network-warning'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/nav/nav'
import '@lit-web3/dui/src/nav/footer'
import '@lit-web3/dui/src/connect-wallet/btn'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  get account() {
    return bridgeStore.bridge.account
  }
  render() {
    return html`<network-warning></network-warning>
      <dui-header>
        <dui-nav slot="center">
          <dui-link href="/" nav alias="/search">Search</dui-link>
          ${when(this.account, () => html`<dui-link href=${`/address/${this.account}`} nav exact>My DOID</dui-link>`)}
          <dui-link href="/favorites" nav>Favorites</dui-link>
          <dui-link href="https://lockpass.doid.tech/passes" nav>My Lock Pass</dui-link>
        </dui-nav>
        <connect-wallet-btn slot="wallet" dropable></connect-wallet-btn>
      </dui-header>
      <main class="dui-app-main">
        <slot></slot>
      </main>
      <dui-footer>
        <div slot="right">
          <dui-link href="/faq" class="uri">FAQ</dui-link>
        </div>
      </dui-footer>`
  }
}

AppRoot({ routes })