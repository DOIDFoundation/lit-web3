import { ThemeElement, html, createRef, ref, customElement, when, state } from '@lit-web3/dui/shared/theme-element'
import style from './style.css?inline'

@customElement('connect-btn')
export class ConnectBtn extends ThemeElement(style) {
  render() {
    return html`<div class="mt-8 lg_mt-10 text-center">
      <a class="btn connect-btn" href="https://app.doid.tech" target="_blank">Get Your DOID</a>
    </div>`
  }
}
