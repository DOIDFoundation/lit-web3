import {
  TailwindElement,
  html,
  customElement,
  property,
  when,
  classMap,
  state
} from '@lit-web3/dui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { setAddrSignMessage } from '@lit-web3/ethers/src/nsResolver'

// Components
import '@lit-web3/dui/src/step-card'
// Styles
import style from './set.css?inline'

@customElement('doid-set-record-wallet')
export class SetRecordWallet extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Object }) coin = {}
  @property({ type: String }) name = ''
  @property({ type: String }) address = ''

  @state() step = 1 //step1: sign, step2: set
  @state() signatureInfo: any = {}
  @state() pending: Record<string, boolean> = { sign: false, set: false }
  @state() err: Record<string, string> = { sign: '', set: '' }

  get ownerAddress() {
    // get from sessionStorage
    return this.address
  }
  get account() {
    // account
    return bridgeStore.bridge.account
  }
  get isStep1() {
    return this.step === 1
  }

  get btnSignDisabled() {
    return this.pending.sign || this.err.sign
  }
  getSignatureMessage = async () => {
    // get sign
    if (this.pending.sign || this.name || this.ownerAddress || this.coin.coinType) return
    this.pending.sign = true
    this.err.sign = ''
    try {
      this.signatureInfo = await setAddrSignMessage(this.name, this.account, this.coin.coinType)
    } catch (e: any) {
      this.err.sign = e.message
    } finally {
      this.pending.sign = false
      // this.ts++
    }
  }
  next = async () => {
    this.step = 2
  }
  connectedCallback(): void {
    super.connectedCallback()
    if (this.step == 1) {
      this.getSignatureMessage()
    }
  }
  disconnectedCallback = () => {
    super.disconnectedCallback()
  }

  render() {
    return html`<div class="set-record">
      <div class="dui-container">
        <div class="border-b-2 flex my-4 px-3 pr-4 justify-between">
          <div>You are setting <b>${this.coin.name}</b> address of <b>${this.name}</b> to ${this.ownerAddress}</div>
          <div><a href="javascript:void(0)">Change address to set</a></div>
        </div>
        <div>
          ${when(
            this.pending.sign,
            () => html``,
            () => html`<div class="px-3">
              <h3 class="text-base">Setting an address requires you to complete 2 steps</h3>
              <div class="grid md_grid-cols-2 gap-4 my-4">
                <dui-card index="1" class="rounded-md ${classMap({ active: this.step >= 1 })}">
                  <div slot="title">
                    <b>SIGN A MESSAGE TO VERIFY YOUR ADDRESS</b>
                  </div>
                  <div slot="description" class="flex flex-col gap-2">
                    <p>Your wallet will open and following message will be shown:</p>

                    <div>
                      <span class="text-gray-500">Message:</span>
                      <p class="break-words">${this.signatureInfo.signature}</p>
                    </div>
                  </div>
                </dui-card>
                <dui-card index="2" class="rounded-md ${classMap({ active: this.step >= 2 })}">
                  <div slot="title">
                    <b>Complete Setting</b>
                  </div>
                  <div slot="description" class="flex flex-col gap-2">
                    <p>You need to change your wallet back to the address that owns <b>${this.name}</b></p>
                    <p>
                      Click 'set' and your wallet will re-open. Only after the transaction is confirmed your address
                      will be set.
                    </p>
                  </div>
                </dui-card>
              </div>
              <div class="mt-4 text-center">
                <dui-button @click=${this.next} ?disabled=${this.btnSignDisabled} ?pending=${this.pending.sign}
                  >Sign message<i
                    class="mdi ml-2 ${classMap(this.$c([this.pending.sign ? 'mdi-loading' : 'mdi-chevron-right']))}"
                  ></i>
                </dui-button>
              </div>
            </div>`
          )}
          <div></div>
        </div>
      </div>
    </div>`
  }
}
