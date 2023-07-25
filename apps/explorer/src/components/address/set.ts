import {
  TailwindElement,
  html,
  customElement,
  property,
  when,
  classMap,
  repeat,
  state
} from '@lit-web3/dui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { getSignerMessage, signMessage, setAddressByOwner } from '@lit-web3/ethers/src/nsResolver'
import { useStorage } from '@lit-web3/ethers/src/useStorage'

// Components
import '@lit-web3/dui/src/step-card'
import '@lit-web3/dui/src/dialog/prompt'
// Styles
import style from './set.css?inline'

@customElement('doid-set-record-wallet')
export class DoidSetRecordWallet extends TailwindElement(style) {
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
  @state() dialog = false

  get ownerAddress() {
    return this.stored.source
  }
  get dest() {
    return this.stored.dest
  }
  get msg() {
    return this.stored.message || ''
  }
  get cookedMsg() {
    return this.msg.split('\n').map((r: string) => {
      const title: string = (r.match(/^(.+:\s)/) || [])[0] || ''
      return { title, content: r.replace(title, '') }
    })
  }
  get account() {
    return bridgeStore.bridge.account
  }
  get coinType() {
    return this.coin.coinType
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
  get isCurrentEqualToDest() {
    return this.currentAddr === this.dest?.toLowerCase()
  }
  get btnSignDisabled() {
    if (!this.currentAddr) return false
    return this.pending || this.err || this.isCurrentEqualToDest || this.txPending
  }
  get btnSetDisabled() {
    return this.pending || this.err || !this.signature || !this.owner || this.txPending
  }

  showTip = () => {
    this.dialog = true
  }
  close = () => {
    this.dialog = false
  }
  getStorage = async () => {
    return await useStorage(`sign.${this.name}`, { store: sessionStorage, withoutEnv: true })
  }
  getStoredInfo = async () => {
    const storage = await this.getStorage()
    const stored = await storage.get()
    this.stored = stored
    if (this.stored?.signature) this.step = 2
  }
  getSignerMessage = async () => {
    const dest: string = this.account
    const coinType: number = this.coin.coinType
    // name, dest, coinType
    const res = await getSignerMessage(this.name, dest, coinType)
    // get {name, dest, timestamp,nonce, message}, and store
    const storage = await this.getStorage()
    const data = { ...this.stored, ...res }
    storage.set(data)
    this.stored = data
  }
  signMessage = async () => {
    const storage = await this.getStorage()
    // get signature and store
    const signature = await signMessage(this.msg)
    const data = { ...this.stored, ...signature }
    storage.set(data)
    this.stored = data
  }

  sign = async () => {
    // get sign
    if (!this.name || !this.ownerAddress || !this.coin.coinType || !this.account || !this.msg) return
    if (this.isCurrentEqualToDest) return
    // if (this.owner && this.currentAddr) return
    this.pending = true
    this.err = ''
    try {
      await this.signMessage()
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
      this.tx = await setAddressByOwner(name, coinType, dest, +timestamp, nonce, signature)
      const success = await this.tx.wait()
      storage.remove()
      this.success = success
      this.step = 3
      this.emit('success')
    } catch (err: any) {
      this.err = err.message
    } finally {
      this.pending = false
      storage.remove()
    }
  }

  async connectedCallback() {
    super.connectedCallback()
    await this.getStoredInfo()
    if (this.dest == this.account || this.signature) return
    await this.getSignerMessage()
  }
  disconnectedCallback = () => {
    super.disconnectedCallback()
    this.step = 1
    this.dialog = false
  }

  render() {
    return html`<div class="set-record border border-gray-300 border-dashed pt-2 pb-5 mt-2 mb-4">
      <div class="px-3">
        <div class="border-b-2 flex my-4 px-3 pr-4 space-x-4 justify-between">
          <div>
            You are setting <b>${this.coin.name}</b> address to
            <b class="break-words break-all">${this.dest}</b>
          </div>
          ${when(
            this.isStep1,
            () => html`<div @click=${this.showTip}>
                <a href="javascript:void(0)" class="text-blue-400">Change address to set</a>
              </div>
              ${when(
                this.dialog,
                () => html`<dui-prompt @close=${this.close}>
                  <div class="text-base">Open your wallet and switch to the address you want to set.</div>
                </dui-prompt>`
              )}`
          )}
        </div>
        <div>
          ${when(
            this.pending && !this.ownerAddress,
            () => html``,
            () => html`<div class="px-3">
              <h3 class="text-base">Setting an address requires you to complete 2 steps</h3>
              <div class="grid md_grid-cols-2 gap-4 my-4">
                <dui-card index="1" class="rounded-md ${classMap({ done: this.step > 1, active: this.step >= 1 })}">
                  <div slot="title">
                    <b>SIGN A MESSAGE TO VERIFY YOUR ADDRESS</b>
                  </div>
                  <div slot="description" class="flex flex-col gap-2">
                    <p>Your wallet will open and following message will be shown:</p>

                    <div class="break-words break-all">
                      ${when(
                        this.msg,
                        () =>
                          html`<span class="text-gray-500">Message:</span> ${repeat(
                              this.cookedMsg,
                              (msg) => html`<p><b>${msg.title}</b>${msg.content}</p>`
                            )}`
                      )}
                    </div>
                  </div>
                </dui-card>
                <dui-card index="2" class="rounded-md ${classMap({ done: this.step > 2, active: this.step >= 2 })}">
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
                    @click=${this.sign}
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
