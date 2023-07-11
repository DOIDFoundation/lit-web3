import { TailwindElement, html, customElement, when, state, keyed } from '@lit-web3/dui/src/shared/TailwindElement'
import { uiKeyring, StateController } from '~/store/keyringState'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/address'
import '~/components/chain/list'
import '~/components/chain/accounts'

import style from './main.css?inline'
@customElement('view-main')
export class ViewMain extends TailwindElement(style) {
  bindKeyring: any = new StateController(this, uiKeyring)
  @state() curChain = null as any

  get name() {
    return uiKeyring.selectedDOID?.name
  }
  get key() {
    const { name: chain } = this.curChain ?? {}
    return [chain, this.name].join('-')
  }

  onSwitch(e: CustomEvent) {
    this.curChain = e.detail
  }
  connectedCallback() {
    super.connectedCallback()
  }
  render() {
    return html`<div class="main">
      <div class="w-full h-full flex items-stretch">
        <network-list class="bg-gray-200 shrink" @switch=${this.onSwitch}></network-list>
        ${keyed(
          this.key,
          html`<account-list class="grow p-2 pl-3" .chain=${this.curChain} .name=${this.name}>Addresses:</account-list>`
        )}
      </div>
    </div>`
  }
}
