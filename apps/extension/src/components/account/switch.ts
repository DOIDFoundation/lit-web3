import { customElement, TailwindElement, html, state, when, classMap } from '@lit-web3/dui/src/shared/TailwindElement'

import '@lit-web3/dui/src/address/avatar'
import '@lit-web3/dui/src/address/name'
import '@lit-web3/dui/src/menu/drop'
import './menu'
import { getAccount, setAccountIdx, getAccounts } from '~/lib.legacy/account'

@customElement('account-switch')
export class AccountSwitch extends TailwindElement(null) {
  @state() name = ''
  @state() address = ''
  @state() menu = false

  get empty() {
    return !this.name || !this.address
  }
  get dropable() {
    return true //getAccounts().length > 1
  }
  get isUnlocked() {
    //TODO: get from keyring
    return false
  }

  getCurrent = () => {
    const { name, mainAddress } = getAccount()
    this.name = name
    this.address = mainAddress
  }
  connectedCallback() {
    this.getCurrent()
    super.connectedCallback()
  }

  show = (e: CustomEvent) => {
    e.stopPropagation()
    if (this.dropable) {
      this.menu = !this.menu
    }
  }
  onSwitch = (e: CustomEvent) => {
    const { idx } = e.detail
    setAccountIdx(idx)
    this.getCurrent()
    this.menu = false
  }

  render() {
    if (this.empty) return ''
    return html`<div class="relative">
      <dui-button md @click=${this.show} text class="inline-flex items-center">
        <dui-name-address avatar .name=${this.name} .address=${this.address} class="tex"></dui-name-address>${when(
          this.dropable,
          () =>
            html`<i
              class="text-xl mdi  ${classMap({ 'mdi-chevron-down': !this.menu, 'mdi-chevron-up': this.menu })}"
            ></i>`
        )}
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
