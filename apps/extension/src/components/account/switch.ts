import { customElement, ThemeElement, html, state } from '@lit-web3/dui/shared/theme-element'
import { uiKeyring, StateController } from '~/store/keyringState'
// Components
import '@lit-web3/dui/address/name'
import '@lit-web3/dui/menu/drop'
import './menu'

@customElement('account-switch')
export class AccountSwitch extends ThemeElement(null) {
  bindKeyring: any = new StateController(this, uiKeyring)

  @state() menu = false

  get selected() {
    return uiKeyring.selectedDOID
  }

  close = () => (this.menu = false)

  render() {
    if (!this.selected) return ''
    return html`
      <dui-drop
        .show=${this.menu}
        @change=${(e: CustomEvent) => (this.menu = e.detail)}
        btnText
        btnDense
        icon
        dropClass="w-72"
      >
        <dui-name-address slot="button" avatar .DOID=${this.selected} wrap></dui-name-address>
        <!-- Content -->
        <account-menu @switch=${this.close}></account-menu>
      </dui-drop>
    `
  }
}
