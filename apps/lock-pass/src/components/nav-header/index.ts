import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/connect-wallet/btn'
import '@lit-web3/dui/src/block-number'
import '@lit-web3/dui/src/network-warning'
import '@lit-web3/dui/src/link'

import style from './nav-header.css'

@customElement('nav-header')
// @ts-ignore
export class NavHeader extends TailwindElement(style) {
  render() {
    return html`
      <header class="nav-header">
        <div class="dui-container grid grid-cols-3 h-full justify-between items-center">
          <div class="flex items-center">
            <a class="doid-logo" href="https://doid.tech"></a>
          </div>

          <nav class="flex h-full gap-3 lg_gap-6 justify-center items-center">
            <dui-link href="/" nav>Lock Name</dui-link>
            <dui-link href="/passes" nav>My Pass</dui-link>
          </nav>
          <div class="flex justify-end items-center">
            <connect-wallet-btn></connect-wallet-btn>
          </div>
        </div>
      </header>
    `
  }
}
