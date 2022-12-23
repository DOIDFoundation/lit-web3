import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  repeat,
  when
} from '@lit-web3/dui/src/shared/TailwindElement'
// import { goto } from '@lit-web3/dui/src/shared/router'
import { nameInfo, ownerRecords } from '@lit-web3/ethers/src/nsResolver'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'

// Components
import '@/components/address/item'

import style from './details.css?inline'
@customElement('view-name-details')
export class ViewNameDetails extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: nameInfo }) info = {}
  @property() name = ''

  @state() pending = false
  @state() ts = 0
  @state() records: any = []

  get account() {
    return bridgeStore.bridge.account
  }
  get empty() {
    return !this.records?.length
  }
  get = async () => {
    this.ts++
  }

  connectedCallback() {
    this.get()
    super.connectedCallback()
    // console.info({ info: this.info })
    this.fetchRecords()
  }

  fetchRecords = async () => {
    this.records = await ownerRecords(this.info?.name)
  }

  render() {
    if (new URL(location.href).searchParams.get('sign')) return html``
    return html`
      <div class="px-3 py-4">
        <div class="flex justify-start items-center mb-3">
          <div class="item_key">PARENT</div>
          <div><a href="/name/doid/details" class="text-blue-500">doid</a></div>
        </div>
        <hr class="mb-3 border-t border-dashed border-gray-300" />
        <div class="flex flex-col lg_flex-row justify-start items-start mb-3">
          <div class="item_key">ADDRESS</div>
          <div class="flex flex-col">
            ${when(
              this.empty,
              () => html``,
              () =>
                html`${repeat(
                  this.records,
                  (item: any) =>
                    html`<doid-addr-item
                      key=${item.coinType}
                      .item=${item}
                      .name=${this.name}
                      .owner=${this.info.itsme}
                    ></doid-addr-item>`
                )}`
            )}
          </div>
        </div>
      </div>
    `
  }
}
