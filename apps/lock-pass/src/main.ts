import AppRoot from '@lit-web3/dui/shared/app-root.ethers'
import { routes } from '~/router'
import { ThemeElement, html, customElement } from '@lit-web3/dui/shared/theme-element'
// Components
import '@lit-web3/dui/network-warning'
import '@lit-web3/dui/nav/header'
import '@lit-web3/dui/nav/nav'
import '@lit-web3/dui/nav/footer'

@customElement('app-main')
export class AppMain extends ThemeElement('') {
  render() {
    return html`
      <network-warning></network-warning>
      <dui-header>
        <dui-nav slot="center">
          <dui-link href="/" nav>Lock Name</dui-link>
          <dui-link href="/passes" nav>My Pass</dui-link>
        </dui-nav>
      </dui-header>
      <main class="dui-app-main">
        <slot></slot>
      </main>
      <dui-footer></dui-footer>
    `
  }
}

AppRoot({ routes })
