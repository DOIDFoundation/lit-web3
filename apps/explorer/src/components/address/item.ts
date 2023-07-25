import {
  TailwindElement,
  html,
  customElement,
  property,
  when,
  state,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { useStorage } from '@lit-web3/ethers/src/useStorage'
import emitter from '@lit-web3/core/src/emitter'
import { scrollTop } from '@lit-web3/dui/src/shared/router'

// Components
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/address'
import '@lit-web3/dui/src/copy/icon'
import './set'

// Style
import style from './item.css?inline'

@customElement('doid-addr-item')
export class DoidAddrItem extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Object }) item: any = {}
  @property({ type: Boolean }) owner = false
  @property({ type: String }) name = ''

  @state() tip: Record<string, string> = { addr: '' }
  @state() err: Record<string, string> = { addr: '', tx: '' }
  @state() pending = false
  @state() addrValid = false
  @state() mode = ''
  @state() stored: Record<string, string> = {}

  storage: any = {}
  get account() {
    return bridgeStore.bridge.account
  }
  get isOwner() {
    return this.owner == true
  }
  get isEditing() {
    return this.mode === 'edit' || this.isStored
  }

  get isStored() {
    return !!this.stored?.source && this.stored?.coinType === this.coinType.coinType
  }
  get editDisabled() {
    return this.pending
  }

  get address() {
    return this.item.address
  }

  get coinType() {
    return { name: this.item.name, coinType: this.item.coinType }
  }

  async checkEditInfo() {
    const stored = await this.storage.get()
    this.stored = stored
  }

  listener = (e: any) => {
    this.reset()
  }

  reset = (clear = false) => {
    this.mode = ''
    this.stored = {}
    if (clear) this.storage.remove()
  }

  setAddr = async () => {
    if (this.isEditing) return this.reset(true)
    // TODO: generate once
    emitter.emit('addr-edit')
    this.mode = 'edit'
    this.storage.set({ ...this.coinType, source: this.address || this.account })
    scrollTop()
    await this.checkEditInfo()
  }
  onSuccess = (e: CustomEvent) => {
    this.reset()
    this.emit('success')
  }

  async connectedCallback() {
    super.connectedCallback()
    this.storage = await useStorage(`sign.${this.name}`, { store: sessionStorage, withoutEnv: true })
    await this.checkEditInfo()
    emitter.on('addr-edit', this.listener)
    this.storage.on(this.listener)
  }
  disconnectedCallback = async () => {
    super.disconnectedCallback()
    this.reset()
    emitter.off('addr-edit', this.listener)
    this.storage.off()
  }

  render() {
    return html`<div class="flex items-center ${this.mode}">
        <div class="addr_name w-14 lg_w-16 text-gray-400">${this.coinType.name}</div>
        <div class="grow flex items-center h-8">
          ${when(
            this.address,
            () => html`<dui-address avatar copy .address=${this.address}></dui-address>`,
            () => html`<span class="text-gray-400 mr-1">Not set</span>`
          )}
          ${when(
            this.isOwner,
            () => html`<dui-button @click=${this.setAddr} sm icon .disabled=${this.editDisabled}
              ><i
                class="mdi ${classMap({
                  'mdi-pencil-off-outline': this.isEditing,
                  'mdi-pencil-outline': !this.isEditing
                })}"
              ></i
            ></dui-button>`
          )}
        </div>
      </div>
      ${when(
        this.isEditing,
        () =>
          html`<doid-set-record-wallet
            .name=${this.name}
            .coin=${this.coinType}
            .owner=${this.isOwner}
            .currentAddr=${this.address}
            @success=${this.onSuccess}
            class="mt-4"
          ></doid-set-record-wallet>`
      )}`
  }
}
