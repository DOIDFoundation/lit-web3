import { TailwindElement, html, customElement, property, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { screenStore } from '@lit-web3/core/src/screen'
import { ownerNames } from '@lit-web3/ethers/src/nsResolver'
import { shortAddress } from '@lit-web3/ethers/src/utils'
// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/nav/nav'
import '~/components/names/list'
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/nav/nav'

import style from './address.css?inline'
@customElement('view-address')
export class ViewAddress extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindScreen: any = new StateController(this, screenStore)
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
    return this.bridge.account.toLowerCase() === this.address.toLowerCase()
  }
  get shortAddr() {
    return shortAddress(this.address)
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
          .default=${this.address}
          @search=${(e: CustomEvent) => goto(`/address/${e.detail}`)}
          placeholder="Search addresses"
        ></dui-ns-search>
        <!-- Tab -->
        ${when(
          this.address,
          () => html`<div class="border-b-2 flex my-4 px-3 pr-4 justify-between">
            <div>
              <b>${screenStore.isMobi ? this.shortAddr : this.address}</b>${when(
                this.itsme,
                () => html`<span class="mx-1">(me)</span>`
              )}
            </div>
            <div>
              <dui-nav slot="center" part="dui-nav">
                <dui-link href=${`${this.scan}/address/${this.address}`}>View on Explorer</dui-link>
              </dui-nav>
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
