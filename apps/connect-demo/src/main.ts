import AppRoot from '@lit-web3/dui/shared/app-root'
import { routes } from '~/router'
import { ThemeElement, html, customElement } from '@lit-web3/dui/shared/theme-element'

@customElement('app-main')
export class AppMain extends ThemeElement('') {
  render() {
    return html`
      <main class="app-main">
        <slot></slot>
      </main>
    `
  }
}

AppRoot({ routes })
