import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  repeat,
  when,
  keyed
} from '@lit-web3/dui/src/shared/TailwindElement'
import { ownerRecords } from '@lit-web3/ethers/src/nsResolver'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
// Components
import '@/components/address/item'

import style from './details.css?inline'
@customElement('view-name-details')
export class ViewNameDetails extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Object }) info!: NameInfo
  @property({ type: String }) name = ''

  @state() pending = false
  @state() ts = 0
  @state() records: any = []

  get account() {
    return bridgeStore.bridge.account
  }
  get empty() {
    return this.ts && !this.records?.length
  }
  get details() {
    const address = this.info.owner
    return [
      { title: 'Registrant', address },
      { title: 'Controller', address }
    ].map((r: any) => {
      r.link = `/address/${r.address}`
      return r
    })
  }

  connectedCallback() {
    super.connectedCallback()
    this.fetchRecords()
  }

  fetchRecords = async () => {
    this.pending = true
    try {
      this.records = await ownerRecords(this.info.name)
    } catch (err) {}
    this.pending = false
    this.ts++
  }
  onSuccess = () => {
    this.fetchRecords()
  }

  render() {
    return html`
      <div class="px-3">
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
            <strong>Addresses</strong>
            <div class="info-cnt">
              ${when(!this.ts && this.pending, () => html`<i class="mdi mdi-loading"></i>`)}
              <div class="doid-addr-items -mt-1 flex justify-start items-start flex-col gap-4">
                ${when(
                  this.empty,
                  () => html`Something went wrong`,
                  () =>
                    html`${repeat(
                      this.records,
                      (item: any) =>
                        html`${keyed(
                          item.address,
                          html`<doid-addr-item
                            key=${item.coinType}
                            .item=${item}
                            .name=${this.name}
                            .owner=${this.info.itsme}
                            @success=${this.onSuccess}
                          ></doid-addr-item>`
                        )}`
                    )}`
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    `
  }
}
