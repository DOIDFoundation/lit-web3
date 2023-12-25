import AppRoot from '@lit-web3/dui/src/shared/AppRoot'
import { routes } from '~/router'
import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  render() {
    return html`
      <main class="app-main">
        <slot></slot>
      </main>
    `
  }
}

AppRoot({ routes })
