import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  repeat
} from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/nav/nav'

import style from './address.css'
@customElement('view-address')
export class ViewAddress extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property() address = ''
  @property() action = ''

  @state() pending = false
  @state() ts = 0

  get bridge() {
    return bridgeStore.bridge
  }

  get empty() {
    return !this.address
  }
  get scan() {
    return this.bridge.network.current.scan
  }

  get = async () => {
    this.ts++
  }

  connectedCallback() {
    this.get()
    super.connectedCallback()
  }

  render() {
    return html`<div class="view-address">
      <div class="dui-container">
        <dui-ns-search
          .text=${this.address}
          @search=${(e: CustomEvent) => goto(`/address/${e.detail}`)}
          placeholder="Search addresses"
        >
          <span slot="label"></span>
          <span slot="msgd"></span>
        </dui-ns-search>
        <!-- Pending -->
        ${when(this.pending, () => html`<i class="mdi mdi-loading"></i> Searching...`)}
        <!-- Tab -->
        ${when(
          this.address,
          () => html`<div class="border-b-2 flex my-4 px-3 pr-4 justify-between">
            <div>
              <b>${this.address}</b>
            </div>
            <div>
              <dui-link href=${`${this.scan}/address/${this.address}`}>View on Explorer</dui-link>
            </div>
          </div>`
        )}
        <!-- Register -->
        <div class="px-3">
          <ul>
            <li>lists</li>
          </ul>
        </div>
      </div>
    </div>`
  }
}
