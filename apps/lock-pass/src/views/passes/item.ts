import { TailwindElement, html, classMap } from '@lit-web3/dui/src/shared/TailwindElement'
import { customElement, property, state } from 'lit/decorators.js'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { when } from 'lit/directives/when.js'
import { getContracts } from '@lit-web3/ethers/src/useBridge'

// Components
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/dialog'
import '@lit-web3/dui/src/tx-state'
import '@lit-web3/dui/src/doid-claim-name'

import style from './item.css?inline'
@customElement('pass-item')
export class PassItem extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Object }) item: any = {}
  @state() tx: any = null
  @state() success = false
  @state() dialog = false

  get bridge() {
    return bridgeStore.bridge
  }
  get scan() {
    return this.bridge.network.current.scan
  }
  get tokenLink() {
    return `${this.scan}/token/${getContracts('Locker')}?a=${this.item.id}`
  }

  onSuccess() {
    this.emit('change')
  }

  render() {
    let stat = ''
    let statTxt = ''
    if (this.item.name) {
      stat = 'locked'
      statTxt = 'Locked'
    } else {
      stat = 'unlock'
      statTxt = 'No name locked yet'
    }

    return html`<div class="pass ${classMap({})}">
      <div
        class="poster ${classMap({ minted: this.item.meta.image, 'opacity-40': this.dialog, grayscale: this.dialog })}"
      >
        <img src=${this.item.meta.image} class="object-contain" />
      </div>
      <div
        class="flex flex-col grow text-xs  ${classMap({
          'opacity-40': this.dialog,
          grayscale: this.dialog
        })}"
      >
        <div>
          <span class="text-base">#${this.item.id}</span>
          <p class="mb-4">
            <dui-link class="text-black uri" href=${this.tokenLink} target="_blank">View on etherscan</dui-link>
          </p>
        </div>
        <div>
          <div class="status ${stat}">${statTxt}</div>
          ${when(
            this.item.name,
            () => html`<div class="name ${stat}"><b class="text-blue-600">${this.item.name}</b>.doid</div>`
          )}
          <div class="actions mt-2">
            ${when(
              this.item.name,
              () => html`<doid-claim-name @success=${this.onSuccess} sm .nameInfo=${this.item}></doid-claim-name>`,
              () => html`<dui-button href="/?pid=${this.item.id}" sm>Lock a name</dui-button>`
            )}
          </div>
        </div>
      </div>
    </div>`
  }
}
