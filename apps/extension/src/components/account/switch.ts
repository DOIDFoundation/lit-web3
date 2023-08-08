import { customElement, TailwindElement, html, state, when, classMap } from '@lit-web3/dui/src/shared/TailwindElement'
import { uiKeyring, StateController } from '~/store/keyringState'
import '@lit-web3/dui/src/address/avatar'
import '@lit-web3/dui/src/address/name'
import '@lit-web3/dui/src/menu/drop'
import './menu'

@customElement('account-switch')
export class AccountSwitch extends TailwindElement(null) {
  bindKeyring: any = new StateController(this, uiKeyring)

  @state() menu = false

  get selected() {
    return uiKeyring.selectedDOID
  }
  get name() {
    return this.selected?.name
  }
  get address() {
    return this.selected?.address
  }

  close = () => {
    this.menu = false
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    if (!this.name) return ''
    return html`<div class="relative">
      <dui-button @click=${() => (this.menu = !this.menu)} text class="inline-flex items-center !px-0">
        <dui-name-address avatar .name=${this.name} .address=${this.address} class="tex" wrap></dui-name-address>
        <i class="text-xl mdi  ${classMap({ 'mdi-chevron-down': !this.menu, 'mdi-chevron-up': this.menu })}"></i>
      </dui-button>
      <dui-drop .show=${this.menu} @close=${this.close} alignLeft>
        <account-menu @switch=${this.close}></account-menu>
      </dui-drop>
    </div>`
  }
}
