import { TailwindElement, html, classMap } from '@lit-web3/dui/src/shared/TailwindElement'
import { customElement, property, state } from 'lit/decorators.js'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { when } from 'lit/directives/when.js'
import { getContracts } from '@lit-web3/ethers/src/useBridge'
import { claim } from '@/lib/locker'

// Components
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/dialog'
import '@lit-web3/dui/src/tx-state'

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
  get txPending() {
    return this.tx && !this.tx?.ignored
  }

  close(force = false) {
    this.dialog = false
    this.tx = undefined
    if (force) this.emit('change')
  }

  doClaim = async () => {
    try {
      this.tx = await claim(this.item.id)
      this.success = await this.tx.wait()
    } catch (err: any) {
      if (err.code === 4001) return
    }
  }
  claim() {
    this.dialog = true
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
        class="flex flex-col justify-between text-xs  ${classMap({
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
              () =>
                html`<dui-button
                  ?disabled=${this.dialog}
                  ?pending=${this.dialog}
                  class="secondary"
                  @click=${this.claim}
                  sm
                  >Claim</dui-button
                >`,
              () => html`<dui-button href="/?pid=${this.item.id}" sm>Lock a name</dui-button>`
            )}
          </div>
        </div>
      </div>
      <!-- Tx Dialog -->
      ${when(
        this.dialog,
        () => html`<dui-dialog @close=${() => this.close()}>
          <div slot="header">Claim DOID name</div>
          <!-- Content -->
          <div class="min-h-10">
            ${when(
              !this.tx?.success,
              () => html`
                <div class="text-center">
                  You are claiming for:
                  <p class="text-black my-4 text-lg"><b class="text-blue-600">${this.item.name}</b>.doid</p>
                  <p class="">
                    ${html`(Note: This pass <b>#${this.item.id}</b> will be burned after claiming.)</b></b>`}
                  </p>
                </div>
              `
            )}
            ${when(
              this.txPending,
              () => html`<tx-state
                .tx=${this.tx}
                .opts=${{ state: { success: `Success. You are the registrant of ${this.item.name} now` } }}
                ><dui-button slot="view" @click=${() => this.close(true)}>Close</dui-button></tx-state
              >`,
              () =>
                html`<p class="mt-8 text-center">
                  <dui-button class="success" @click=${this.doClaim}>Continue</dui-button>
                </p>`
            )}
          </div>
          <!-- Bottom -->
        </dui-dialog>`
      )}
    </div>`
  }
}
