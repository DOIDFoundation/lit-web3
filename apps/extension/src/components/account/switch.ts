import { customElement, TailwindElement, html, state, when, classMap } from '@lit-web3/dui/src/shared/TailwindElement'

import '@lit-web3/dui/src/address/avatar'
import '@lit-web3/dui/src/address/name'
import '@lit-web3/dui/src/menu/drop'
import './menu'
import popupMessenger from '~/lib.next/messenger/popup'

@customElement('account-switch')
export class AccountSwitch extends TailwindElement(null) {
  @state() name = ''
  @state() address = ''
  @state() menu = false
  @state() selected: VaultDOID | undefined

  get empty() {
    return !this.selected
  }
  get dropable() {
    return true //getAccounts().length > 1
  }

  getSelected = async () => {
    this.selected = await popupMessenger.send('internal_getSelected')
    console.log(this.selected)
  }
  connectedCallback() {
    super.connectedCallback()
    this.getSelected()
  }
  show = (e: CustomEvent) => {
    e.stopPropagation()
    if (this.dropable) {
      this.menu = !this.menu
    }
  }
  onSwitch = (e: CustomEvent) => {
    // const { idx } = e.detail
    // setAccountIdx(idx)
    // this.getCurrent()
    // this.menu = false
  }

  render() {
    if (this.empty) return ''
    return html`<div class="relative">
      <dui-button md @click=${this.show} text class="inline-flex items-center">
        <dui-name-address
          avatar
          .name=${this.selected?.name}
          .address=${this.selected?.address}
          class="tex"
          wrap
        ></dui-name-address
        >${when(
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
