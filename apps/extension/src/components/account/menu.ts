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
import { goto } from '@lit-web3/dui/src/shared/router'
import { uiKeyring, StateController } from '~/store/keyringState'
import popupMessenger from '~/lib.next/messenger/popup'

import css from './menu.css?inline'

@customElement('account-menu')
export class AccountMenu extends TailwindElement(css) {
  bindKeyring: any = new StateController(this, uiKeyring)

  @property({ type: Boolean }) show = false

  get DOIDs() {
    return Object.values(uiKeyring.DOIDs)
  }
  get selected() {
    return uiKeyring.selectedDOID
  }

  lock = async () => {
    await popupMessenger.send('lock')
  }
  select = async (DOID: VaultDOID) => {
    await popupMessenger.send('internal_selectDOID', DOID)
    uiKeyring.sync()
    this.emit('switch')
  }
  create = () => {
    goto('/create')
    this.emit('switch')
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`
      <div>
        <div class="flex justify-between items-center py-3 px-4 border-b">
          <span>My DOID accounts</span>
          <dui-button sm class="outlined" @click=${this.lock}>Lock</dui-button>
        </div>

        <div class="py-1">
          ${repeat(
            this.DOIDs,
            (DOID) => html`<div class="menu-list" @click=${() => this.select(DOID)}>
              <div class="menu-list-left">
                <i
                  class="menu-list-icon mdi mdi-check ${classMap(
                    this.$c([this.selected?.name == DOID.name ? 'text-green-500' : 'invisible'])
                  )}"
                ></i>
                <dui-name-address avatar short .name=${DOID.name} .address=${DOID.address}></dui-name-address>
              </div>
            </div>`
          )}
        </div>

        <div class="border-t py-1">
          <div class="menu-list" @click=${() => this.create()}>
            <div class="menu-list-left"><i class="menu-list-icon mdi mdi-plus"></i> Import or Create DOID</div>
          </div>
        </div>

        <!-- <div class="flex items-center gap-2 px-4 py-2">
          <i class="text-xl mdi mdi-tray-arrow-down"></i> Import Account
        </div> -->
      </div>
    `
  }
}
