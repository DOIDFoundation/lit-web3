import AppRoot from '@lit-web3/dui/src/shared/AppRoot.ethers'
import { routes } from '~/router'
import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/nav/footer'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  render() {
    return html`
      <dui-header>
        <p slot="center" class="font-bold">Wallet Demo</p>
      </dui-header>
      <main class="dui-app-main">
        <slot></slot>
      </main>
      <dui-footer></dui-footer>
    `
  }
}

AppRoot({ routes })
