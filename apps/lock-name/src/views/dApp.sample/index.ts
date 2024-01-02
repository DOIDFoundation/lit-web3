import { ThemeElement, html, customElement } from '@lit-web3/dui/shared/theme-element'
// Components
import '@lit-web3/dui/input/text'
import '@lit-web3/dui/input/pwd'
import '@lit-web3/dui/button'
import '@lit-web3/dui/nav/header'
import '@lit-web3/dui/link'
// Methods
import './DOID_requestName'
import './DOID_setup'
import './DOID_subscribe'
import './EVM_subscribe'
// Style
import style from './sample.css?inline'

@customElement('view-dapp')
export class ViewRestore extends ThemeElement(style) {
  render() {
    return html`<div class="sample my-4">
      <div class="dui-container text-sm">
        <h3 class="border-b-2 text-lg">DOID Provider</h3>
        <ul class="sample-methods">
          <li><dapp-method-doid-requestname></dapp-method-doid-requestname></li>
          <li><dapp-method-doid-setup></dapp-method-doid-setup></li>
          <li><dapp-method-doid-subcribe></dapp-method-doid-subcribe></li>
          <li><dapp-method-evm-subcribe></dapp-method-evm-subcribe></li>
        </ul>
      </div>
    </div>`
  }
}
