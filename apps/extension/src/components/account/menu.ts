import {
  customElement,
  TailwindElement,
  html,
  property,
  state,
  repeat,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/address/avatar'
import { goto } from '@lit-web3/dui/src/shared/router'
import popupMessenger from '~/lib.next/messenger/popup'

import css from './menu.css?inline'

@customElement('account-menu')
export class AccountMenu extends TailwindElement(css) {
  @property({ type: Boolean }) show = false
  @state() DOIDs: VaultDOID[] = []
  @state() selected: VaultDOID | undefined

  getDOIDs = async () => {
    const { DOIDs, selectedDOID } = await popupMessenger.send('internal_getDOIDs')
    this.DOIDs = Object.values(DOIDs)
    this.selected = selectedDOID
  }
  lock = async () => {
    await popupMessenger.send('lock')
  }
  select = async (DOID: VaultDOID) => {
    await popupMessenger.send('internal_selectDOID', DOID)
  }

  connectedCallback() {
    super.connectedCallback()
    this.getDOIDs()
  }

  render() {
    return html`
      <div>
        <div class="flex justify-between items-center py-3 px-4 border-b">
          <span>My accounts</span>
          <dui-button sm class="outlined" @click=${this.lock}>Lock</dui-button>
        </div>

        <div class="py-1">
          ${repeat(
            this.DOIDs,
            (DOID) => html`<div class="menu-list" @click=${() => this.select(DOID)}>
              <div class="menu-list-left">
                <i
                  class="menu-list-icon mdi mdi-check ${classMap(
                    this.$c([this.selected?.name == DOID.name ? ' text-green-500 ' : 'invisible'])
                  )} "
                ></i>
                <dui-name-address avatar short .name=${DOID.name} .address=${DOID.address}></dui-name-address>
              </div>
            </div>`
          )}
        </div>

        <div class="border-t py-1">
          <div class="menu-list" @click=${() => goto('/create')}>
            <div class="menu-list-left"><i class="menu-list-icon mdi mdi-plus"></i> Create Account</div>
          </div>
        </div>

        <!-- <div class="flex items-center gap-2 px-4 py-2">
          <i class="text-xl mdi mdi-tray-arrow-down"></i> Import Account
        </div> -->
      </div>
    `
  }
}
