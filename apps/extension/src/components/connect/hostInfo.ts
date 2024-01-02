import { customElement, ThemeElement, html, ifDefined } from '@lit-web3/dui/shared/theme-element'
import { uiConnects, StateController } from '~/store/connectState'
// Components
import '@lit-web3/dui/button'
import '@lit-web3/dui/link'
import '@lit-web3/dui/dialog'

@customElement('connect-host-info')
export class ConnectHostInfo extends ThemeElement(null) {
  bindConnects: any = new StateController(this, uiConnects)

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`<span class="flex items-center space-x-2"
      ><img class="w-5 h-5" src=${ifDefined(uiConnects.tab.favIconUrl)} /><strong>${uiConnects.host}</strong></span
    >`
  }
}
