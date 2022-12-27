// Claim DOID name by passId
import { TailwindElement, html } from './shared/TailwindElement'
import { customElement, property, state } from 'lit/decorators.js'
import { getContract, assignOverrides } from '@lit-web3/ethers/src/useBridge'
import { bridgeStore, StateController, getAccount } from '@lit-web3/ethers/src/useBridge'
import { when } from 'lit/directives/when.js'
import { txReceipt } from '@lit-web3/ethers/src/txReceipt'
import { bareTLD } from '@lit-web3/ethers/src/nsResolver/checker'
// Components
import './dialog'
import './tx-state'

export const claim = async (passId: number) => {
  const contract = await getContract('Locker', { account: await getAccount() })
  const [method, overrides, parameters] = ['claimDoid', {}, [+passId]]
  await assignOverrides(overrides, contract, method, parameters)
  const call = contract[method](...parameters)
  return new txReceipt(call, {
    errorCodes: 'Locker',
    seq: {
      type: 'claim-name',
      title: 'Claim Name',
      ts: new Date().getTime(),
      overrides
    }
  })
}

@customElement('doid-claim-name')
export class DoidClaimName extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Object }) nameInfo!: NameInfo
  @property({ type: Boolean }) sm = false

  @state() tx: any = null
  @state() success = false
  @state() dialog = false

  get name() {
    return bareTLD(this.nameInfo?.name)
  }
  get passId() {
    return this.nameInfo?.id || 0
  }
  get txPending() {
    return this.tx && !this.tx?.ignored
  }

  close(success = false) {
    this.dialog = false
    this.tx = undefined
    if (success) this.emit('success')
    this.emit('show', false)
  }

  claim = async () => {
    try {
      this.tx = await claim(+this.passId)
      this.success = await this.tx.wait()
    } catch (err: any) {
      if (err.code === 4001) return this.close()
    }
  }
  open() {
    this.dialog = true
    this.emit('show', true)
  }

  render() {
    return html`<dui-button
        ?disabled=${this.dialog}
        ?pending=${this.dialog}
        class="success"
        @click=${this.open}
        ?sm=${this.sm}
        ><slot>Claim</slot></dui-button
      >
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
                  <p class="text-black my-4 text-lg"><b class="text-blue-600">${this.name}</b>.doid</p>
                  <p class="">
                    ${html`Note: This pass <b class="text-base text-orange-500">#${this.passId}</b> will be burned after claiming.</b></b>`}
                  </p>
                </div>
              `
            )}
            ${when(
              this.txPending,
              () => html`<tx-state
                .tx=${this.tx}
                .opts=${{ state: { success: `Success. You are the registrant of ${this.name}.doid now` } }}
                ><dui-button slot="view" @click=${() => this.close(true)}>Close</dui-button></tx-state
              >`,
              () =>
                html`<p class="mt-8 text-center">
                  <dui-button class="success" @click=${this.claim}>Continue</dui-button>
                </p>`
            )}
          </div>
          <!-- Bottom -->
        </dui-dialog>`
      )}`
  }
}
