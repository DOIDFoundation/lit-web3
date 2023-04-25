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

  show = (e: CustomEvent) => {
    e.stopPropagation()
    this.menu = !this.menu
  }
  onSwitch = () => {
    this.menu = false
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    if (!this.name) return ''
    return html`<div class="relative">
      <dui-button md @click=${this.show} text class="inline-flex items-center">
        <dui-name-address avatar .name=${this.name} .address=${this.address} class="tex" wrap></dui-name-address>
        <i class="text-xl mdi  ${classMap({ 'mdi-chevron-down': !this.menu, 'mdi-chevron-up': this.menu })}"></i>
      </dui-button>
      ${when(
        this.menu,
        () => html`<dui-drop alignLeft show=${this.menu} @change=${(e: CustomEvent) => (this.menu = e.detail)}>
          <account-menu @switch=${this.onSwitch}></account-menu>
        </dui-drop>`
      )}
    </div>`
  }
}
