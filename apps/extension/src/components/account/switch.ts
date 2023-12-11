import { customElement, TailwindElement, html, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { uiKeyring, StateController } from '~/store/keyringState'
import '@lit-web3/dui/src/address/name'
import '@lit-web3/dui/src/menu/drop'
import './menu'

@customElement('account-switch')
export class AccountSwitch extends TailwindElement(null) {
  bindKeyring = new StateController(this, uiKeyring)

  @state() menu = false

  get selected() {
    return uiKeyring.selectedDOID
  }

  close = () => (this.menu = false)

  render() {
    if (!this.selected) return ''
    return html`
      <dui-drop .show=${this.menu} @change=${(e: CustomEvent) => (this.menu = e.detail)} btnText btnDense icon>
        <dui-name-address slot="button" avatar .DOID=${this.selected} wrap></dui-name-address>
        <!-- Content -->
        <account-menu @switch=${this.close}></account-menu>
      </dui-drop>
    `
  }
}
