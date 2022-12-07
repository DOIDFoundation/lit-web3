import AppRoot from '@lit-web3/dui/src/shared/AppRoot.ethers'
import { routes } from '@/router'
import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/network-warning'
import '@/components/nav-header'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  render() {
    return html`<network-warning></network-warning>
      <nav-header></nav-header>
      <main class="dui-app-main">
        <slot></slot>
      </main>`
  }
}

AppRoot({ routes })
