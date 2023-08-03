import { customElement, TailwindElement, html, ifDefined } from '@lit-web3/dui/src/shared/TailwindElement'
import { uiConnects, StateController } from '~/store/connectState'
// Components
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/dialog'

@customElement('connect-host-info')
export class ConnectHostInfo extends TailwindElement(null) {
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
