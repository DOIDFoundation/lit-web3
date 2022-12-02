import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/block-number'
import '@lit-web3/dui/src/link'

import style from './nav-footer.css'

@customElement('nav-footer')
// @ts-ignore
export class NavFooter extends TailwindElement(style) {
  render() {
    return html`
      <footer class="nav-footer">
        <div class="dui-container grid grid-cols-3 justify-between items-center gap-4">
          <div class="opacity-80">
            <block-number></block-number>
          </div>
          <div class="flex justify-center items-center text-center">
            <dui-link href="https://doid.tech">doid.tech</dui-link>
          </div>

          <div class="flex justify-end items-center">
            <span class="opacity-50">${import.meta.env.VITE_APP_VER}</span>
          </div>
        </div>
      </footer>
    `
  }
}
