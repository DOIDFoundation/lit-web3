import {
  customElement,
  TailwindElement,
  html,
  property,
  repeat,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/address/avatar'
import { getAccounts, getAccountIdx } from '~/lib.legacy/account'
import { goto } from '@lit-web3/dui/src/shared/router'

import css from './menu.css?inline'
import popupMessenger from '~/lib.next/messenger/popup'
@customElement('account-menu')
export class AccountMenu extends TailwindElement(css) {
  @property({ type: Boolean }) show = false

  get accounts(): NameInfo[] {
    // TODO: replace by keyring
    return getAccounts()
  }
  get selectedIdx() {
    return getAccountIdx()
  }

  lock = () => {
    popupMessenger.send('lock')
  }
  switch = (idx: number) => {
    if (idx === this.selectedIdx) return
    this.emit('switch', { idx })
  }

  connectedCallback() {
    super.connectedCallback()
  }
  render() {
    return html`
      <div>
        <div class="flex justify-between items-center py-2 px-4">
          <span>My accounts</span>
          <dui-button sm class="outlined" @click=${this.lock}>Lock</dui-button>
        </div>
        <div class="w-full border-b pb-2"></div>
        ${repeat(
          this.accounts,
          (account: NameInfo, idx) => html`<div
            class="flex justify-start items-center cursor-pointer"
            @click=${() => this.switch(idx)}
          >
            <div class="flex items-center gap-2 px-4 py-2">
              <i
                class="text-xl mdi mdi-check ${classMap(
                  this.$c([this.selectedIdx == idx ? ' text-green-500 ' : 'invisible'])
                )} "
              ></i>
              <dui-name-address avatar .name=${account.name} .address=${account.mainAddress}></dui-name-address>
            </div>
          </div>`
        )}
        <div class="w-full border-b py-2"></div>

        <div class="flex items-center gap-2 px-4 py-2" @click=${() => goto('/create')}>
          <i class="text-xl mdi mdi-plus"></i> Create Account
        </div>
        <div class="flex items-center gap-2 px-4 py-2">
          <i class="text-xl mdi mdi-tray-arrow-down"></i> Import Account
        </div>
      </div>
    `
  }
}
