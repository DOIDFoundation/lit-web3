import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  repeat,
  when,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import popupMessenger from '~/lib.next/messenger/popup'
import { uiKeyring, StateController } from '~/store/keyringState'
import { uiConnects } from '~/store/connectState'
import { chainsDefault } from '~/lib.next/chain'
import { goto } from '@lit-web3/dui/src/shared/router'

// Components
import '@lit-web3/dui/src/address/name'
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/menu/drop'
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/input/switch'

import style from './settings.css?inline'

@customElement('view-settings')
export class ViewSettings extends TailwindElement(style) {
  bindKeyring: any = new StateController(this, uiKeyring)
  bindConnects: any = new StateController(this, uiConnects)

  close() {
    goto('/')
  }

  render() {
    return html`<div class="px-4">
      <!-- Header -->
      <div class="flex justify-between items-center font-bold">
        <div class="flex flex-shrink items-center gap-2">
          <span class="inline-flex w-6 h-6 ml-2"><doid-icon></doid-icon></span>
        </div>
        <h4 class="font-bold text-lg">Settings</h4>
        <i @click=${this.close} title="Close" class="text-2xl flex-shrink mdi mdi-close cursor-pointer"></i>
      </div>
      <!-- Body -->
      <div class="py-8">
        <ul>
          <li class="flex justify-between">
            <div><b>Show test networks</b></div>
            <div><dui-input-switch disabled .checked=${true}></dui-input-switch>
          </li>
        </ul>
      </div>
    </div>`
  }
}
