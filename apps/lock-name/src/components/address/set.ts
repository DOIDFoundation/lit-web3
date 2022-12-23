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
import { setAddrSignMessage, setAddrByOwner } from '@lit-web3/ethers/src/nsResolver'
import { useStorage } from '@lit-web3/ethers/src/useStorage'

import { sleep } from '@lit-web3/ethers/src/utils'

// Components
import '@lit-web3/dui/src/step-card'
// Styles
import style from './set.css?inline'

@customElement('doid-set-record-wallet')
export class SetRecordWallet extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Boolean }) owner = false
  @property({ type: Object }) coin: any = {}
  @property({ type: String }) name = ''
  @property({ type: String }) currentAddr = ''

  @state() step = 1 //step1: sign, step2: set
  @state() signatureInfo: any = {}
  @state() pending = false
  @state() err = ''
  @state() stored: Record<string, string> = {}
  @state() tx: any = null
  @state() success = false

  get ownerAddress() {
    return this.stored.source
  }
  get dest() {
    return this.stored.dest
  }
  get msg() {
    return this.stored.msg
  }
  get account() {
    return bridgeStore.bridge.account
  }
  get isStep1() {
    return this.step === 1
  }
  get signature() {
    return this.stored.signature || this.signatureInfo?.signature
  }
  get txPending() {
    return this.tx && !this.tx?.ignored
  }
  get btnSignDisabled() {
    if (!this.currentAddr) return false
    return this.pending || this.err || this.owner || this.txPending
  }
  get btnSetDisabled() {
    return this.pending || this.err || !this.signature || !this.owner || this.txPending
  }

  getStorage = async () => {
    return await useStorage(`sign.${this.name}`, sessionStorage, true)
  }
  getStoredInfo = async () => {
    const storage = await this.getStorage()
    const stored = await storage.get()
    this.stored = stored
    if (this.stored?.signature) this.step = 2
  }
  getSignatureMessage = async () => {
    this.signatureInfo = await setAddrSignMessage(this.name, this.account, this.coin.coinType)
    const storage = await useStorage(`sign.${this.name}`, sessionStorage, true)
    const data = { ...this.stored, ...this.signatureInfo }
    storage.set(data)
    this.stored = data
  }
  next = async () => {
    // get sign
    if (!this.name || !this.ownerAddress || !this.coin.coinType || !this.account) return
    if (this.owner && this.currentAddr) return
    this.pending = true
    this.err = ''
    try {
      await this.getSignatureMessage()
      this.step = 2
    } catch (err: any) {
      if (err.code === 4001) return
      this.err = err.message
    } finally {
      this.pending = false
    }
  }
  setAddr = async () => {
    if (this.pending) return
    this.pending = true
    this.err = ''
    this.success = false
    const { name, coinType, dest, timestamp, nonce, signature } = this.stored
    const storage = await this.getStorage()
    try {
      this.tx = await setAddrByOwner(name, coinType, dest, +timestamp, nonce, signature)
      const success = await this.tx.wait()
      storage.remove()
      await sleep(1000)
      this.success = success
      this.emit('success')
    } catch (e: any) {
      this.err = e
      console.error(e)
    } finally {
      this.pending = false
      storage.remove()
    }
  }

  async connectedCallback(): void {
    super.connectedCallback()
    await this.getStoredInfo()
  }
  disconnectedCallback = () => {
    super.disconnectedCallback()
  }

  render() {
    return html`<div class="set-record border border-gray-300 border-dashed pt-2 pb-5 mt-2">
      <div class="dui-container">
        <div class="border-b-2 flex my-4 px-3 pr-4 justify-between">
          <div>
            You are setting <b>${this.coin.name}</b> address to
            ${when(
              this.isStep1,
              () =>
                html`${when(
                  this.owner,
                  () => html``,
                  () => html`${this.account}`
                )}`,
              () => html`${this.dest || this.account}`
            )}
          </div>
          <!-- <div><a href="javascript:void(0)">Change address to set</a></div> -->
        </div>
        <div>
          ${when(
            this.pending && !this.ownerAddress,
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
                      ${when(
                        this.msg,
                        () => html`<span class="text-gray-500">Message:</span>
                          <p class="break-words">${this.msg}</p>`,
                        () => html``
                      )}
                    </div>
                  </div>
                </dui-card>
                <dui-card index="2" class="rounded-md ${classMap({ active: this.step >= 2 })}">
                  <div slot="title">
                    <b>Complete Setting</b>
                  </div>
                  <div slot="description" class="flex flex-col gap-2">
                    <p class="break-words">
                      You need to change your wallet back to
                      ${when(
                        !this.owner && !this.isStep1,
                        () => html`${this.ownerAddress}`,
                        () => html`the address`
                      )}
                      that owns <b>${this.name}</b>
                    </p>
                    <p>
                      Click 'set' and your wallet will re-open. Only after the transaction is confirmed your address
                      will be set.
                    </p>
                  </div>
                </dui-card>
              </div>
              <div class="mt-4 text-center">
                ${when(
                  this.isStep1,
                  () => html`<dui-button
                    sm
                    @click=${this.next}
                    ?disabled=${this.btnSignDisabled}
                    ?pending=${this.pending}
                    >Sign message<i
                      class="mdi ml-2 ${classMap(this.$c([this.pending ? 'mdi-loading' : 'mdi-chevron-right']))}"
                    ></i>
                  </dui-button>`,
                  () => html`<dui-button
                    sm
                    @click=${this.setAddr}
                    ?disabled=${this.btnSetDisabled}
                    ?pending=${this.pending}
                    >Set<i class="mdi ml-2 ${classMap(this.$c([this.pending ? 'mdi-loading' : '']))}"></i>
                  </dui-button>`
                )}
              </div>
            </div>`
          )}
        </div>
      </div>
    </div>`
  }
}
