import AppRoot from '@lit-web3/dui/src/shared/AppRoot.ethers'
import { routes } from '~/router'
import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/nav/footer'
import '@doidfoundation/connect'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  render() {
    return html`
      <dui-header>
        <p slot="center" class="font-bold">Wallet Demo</p>
        <doid-connect-button appName="Demo App" slot="wallet"></doid-connect-button>
      </dui-header>
      <main class="dui-app-main">
        <slot></slot>
      </main>
      <dui-footer></dui-footer>
    `
  }
}

AppRoot({ routes })
