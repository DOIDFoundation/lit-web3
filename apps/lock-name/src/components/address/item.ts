import { TailwindElement, html, customElement, property, when, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { useStorage } from '@lit-web3/ethers/src/useStorage'

// Components
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/copy'
import './set'

// Style
import style from './item.css?inline'

@customElement('doid-addr-item')
export class EditInline extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Object }) item: any = {}
  @property({ type: Boolean }) owner = false
  @property({ type: String }) name = ''

  @state() tip: Record<string, string> = { addr: '' }
  @state() err: Record<string, string> = { addr: '', tx: '' }
  @state() pending: Record<string, boolean> = { addr: false, tx: false }
  @state() addr = ''
  @state() addrValid = false
  @state() mode = ''
  @state() stored: Record<string, string> = {}

  get account() {
    return bridgeStore.bridge.account
  }
  get isOwner() {
    return this.owner == true
  }
  get isEditing() {
    return this.mode === 'edit'
  }

  get isStored() {
    return this.stored?.source && this.stored?.coinType == this.coinType.coinType
  }
  get editDisabled() {
    return this.isEditing == true
  }

  get address() {
    return this.item.address
  }

  get coinType() {
    return { name: this.item.name, coinType: this.item.coinType }
  }

  async checkEditInfo() {
    const storage = await useStorage(`sign.${this.name}`, sessionStorage, true)
    const stored = await storage.get()
    this.stored = stored
  }
  setAddr = async () => {
    this.mode = 'edit'
    // session
    const storage = await useStorage(`sign.${this.name}`, sessionStorage, true)
    storage.set({ ...this.coinType, source: this.address || this.account })
  }
  onSuccess = () => {
    this.mode = ''
    this.checkEditInfo()
    this.emit('success')
  }

  async connectedCallback(): void {
    super.connectedCallback()
    this.addr = this.address
    await this.checkEditInfo()
  }

  disconnectedCallback = () => {
    super.disconnectedCallback()
  }

  render() {
    return html`<div class="w-full flex justify-start items-center my-3 ${this.mode}">
        <div class="addr_name text-gray-400">${this.coinType.name}</div>
        <div class="grow inline-flex items-center">
          ${when(
            this.address,
            () => html`<div class="mr-1">${this.address}</div>
              <dui-copy .value=${this.address} sm icon
                ><span slot="copied" class="text-green-500">
                  <i class="mdi mdi-check-circle-outline"></i>
                </span>
                <span slot="copy"><i class="mdi mdi-content-copy"></i></span
              ></dui-copy> `,
            () =>
              html`${when(
                this.isOwner,
                () => html`<span class="text-gray-400">No set</span></dui-button>`,
                () => html``
              )}`
          )}
          ${when(
            this.isOwner && !this.isEditing,
            () => html`<dui-button sm icon class="ml-1" .disabled=${this.editDisabled}
              ><i class="mdi mdi-pencil-outline" @click=${this.setAddr}></i
            ></dui-button>`,
            () => html``
          )}
        </div>
      </div>
      ${when(
        this.isEditing || this.isStored,
        () =>
          html`<doid-set-record-wallet
            .name=${this.name}
            .coin=${this.coinType}
            .owner=${this.isOwner}
            @success=${this.onSuccess}
          ></doid-set-record-wallet>`,
        () => html``
      )}`
  }
}
