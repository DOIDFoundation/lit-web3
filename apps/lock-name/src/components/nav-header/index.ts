import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/connect-wallet/btn'
import '@lit-web3/dui/src/network-warning'
import '@lit-web3/dui/src/link'

import style from './style.css'
@customElement('nav-header')
// @ts-ignore
export class NavHeader extends TailwindElement(style) {
  render() {
    return html`
      <header class="nav-header">
        <div class="dui-container grid grid-cols-3 justify-between items-center">
          <div class="flex items-center"><a href="/">NAMELOCK</a></div>
          <nav class="flex justify-center items-center"></nav>
          <div class="flex justify-end items-center">
            <connect-wallet-btn></connect-wallet-btn>
          </div>
        </div>
      </header>
    `
  }
}
