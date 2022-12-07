import AppRoot from '@lit-web3/dui/src/shared/AppRoot.ethers'
import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
import { routes } from '@/router'

// Components
import '@lit-web3/dui/src/network-warning'
import '@/components/nav-header'
// Style

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
