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
import { ownerNames } from '@lit-web3/ethers/src/nsResolver'
// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/nav/nav'
import '@/components/names/list'

import style from './address.css?inline'
@customElement('view-address')
export class ViewAddress extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property() address = ''
  @property() action = ''
  @state() names: NameInfo[] = []

  @state() pending = false
  @state() ts = 0

  get bridge() {
    return bridgeStore.bridge
  }
  get empty() {
    return this.ts && !this.pending && !this.names.length
  }
  get scan() {
    return this.bridge.network.current.scan
  }
  get itsme() {
    return this.bridge.account === this.address
  }

  get = async () => {
    this.pending = true
    this.names = await ownerNames(this.address)
    this.pending = false
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
        <!-- Tab -->
        ${when(
          this.address,
          () => html`<div class="border-b-2 flex my-4 px-3 pr-4 justify-between">
            <div><b>${this.address}</b> ${this.itsme && '(me)'}</div>
            <div>
              <dui-link href=${`${this.scan}/address/${this.address}`}>View on Explorer</dui-link>
            </div>
          </div>`
        )}
        <!-- Names -->
        <doid-name-list
          @change=${this.get}
          .names=${this.names}
          .pending=${!this.ts && this.pending}
          .empty=${this.empty}
        ></doid-name-list>
      </div>
    </div>`
  }
}
