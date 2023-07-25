import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/input/pwd'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/link'
// Methods
import './DOID_requestName'
import './DOID_setup'
import './DOID_subscribe'
// Style
import style from './sample.css?inline'

@customElement('view-dapp')
export class ViewRestore extends TailwindElement(style) {
  render() {
    return html`<div class="sample my-4">
      <div class="dui-container text-sm">
        <h3 class="border-b-2 text-lg">DOID Provider</h3>
        <ul class="sample-methods">
          <li><dapp-method-doid-requestname></dapp-method-doid-requestname></li>
          <li><dapp-method-doid-setup></dapp-method-doid-setup></li>
          <li><dapp-method-doid-subcribe></dapp-method-doid-subcribe></li>
        </ul>
      </div>
    </div>`
  }
}
