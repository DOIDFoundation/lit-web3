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
import { ownerRecords } from '@lit-web3/ethers/src/nsResolver'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { screenStore } from '@lit-web3/core/src/screen'
import { shortAddress } from '@lit-web3/ethers/src/utils'

// Components
import '@/components/address/item'
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/address'
import '@lit-web3/dui/src/copy/icon'

import style from './details.css?inline'
@customElement('view-name-details')
export class ViewNameDetails extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindScreen: any = new StateController(this, screenStore)
  @property({ type: Object }) info!: NameInfo
  @property({ type: String }) name = ''

  @state() pending = false
  @state() ts = 0
  @state() records: any = []

  get details() {
    return [
      { title: 'Registrant', address: this.info.owner },
      { title: 'Controller', address: this.info.owner }
    ].map((r: any) => {
      r.link = `/address/${r.address}`
      return r
    })
  }

  get account() {
    return bridgeStore.bridge.account
  }
  get empty() {
    return !this.records?.length
  }
  get owner() {
    const { owner } = this.info
    return screenStore.isMobi ? shortAddress(owner) : owner
  }
  get ownerLink() {
    return `/address/${this.info.owner}`
  }
  get = async () => {
    this.ts++
  }

  connectedCallback() {
    super.connectedCallback()
    this.get()
    this.fetchRecords()
  }

  fetchRecords = async () => {
    this.records = await ownerRecords(this.info.name)
  }
  onSuccess = () => {
    this.fetchRecords()
  }

  render() {
    if (new URL(location.href).searchParams.get('sign')) return html``
    return html`<div class="px-3">
      <ul class="infos">
        ${repeat(
          this.details,
          (detail) => html`<li class="single">
            <strong>${detail.title}</strong>
            <div class="info-cnt">
              <dui-address avatar copy .address=${detail.address} href=${detail.link}></dui-address>
            </div>
          </li>`
        )}
      </ul>
      <ul class="infos">
        <li>
          <strong class="mt-1">Addresses</strong>
          <div class="info-cnt ">
            <div class="doid-addr-items flex justify-start items-start flex-col gap-4">
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
                        @success=${this.onSuccess}
                      ></doid-addr-item>`
                  )}`
              )}
            </div>
          </div>
        </li>
      </ul>
    </div>`
  }
}
