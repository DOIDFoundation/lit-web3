import { TailwindElement, html, customElement, property, when, state } from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/copy'
import './set'

// Style
import style from './item.css?inline'

@customElement('doid-addr-item')
export class EditInline extends TailwindElement(style) {
  @property({ type: Object }) item: any = {}
  @property({ type: Boolean }) owner = false
  @property({ type: String }) name = ''

  @state() tip: Record<string, string> = { addr: '' }
  @state() err: Record<string, string> = { addr: '', tx: '' }
  @state() pending: Record<string, boolean> = { addr: false, tx: false }
  @state() addr = ''
  @state() addrValid = false
  @state() mode = ''

  get isOwner() {
    return this.owner == true
  }
  get isEditing() {
    return this.mode === 'edit'
  }
  get editDisabled() {
    return this.isEditing == true
  }

  get address() {
    return this.item.address
  }

  /* validate = () => {
    if (!this.addr) {
      this.err = { ...this.err, addr: 'Required' }
    } else {
      this.err = { ...this.err, addr: '' }
    }
    return !this.inputErr
  }

  get inputErr() {
    for (let k in this.err) {
      if (k === 'tx') continue
      if (this.err[k]) return true
    }
    return false
  }

  validAddrByType = (type = this.type) => {
    this.err = { ...this.err, addr: '' }
    const len = unicodelength(this.addr)
    this.addrValid = false
    switch (type) {
      case 'ETH':
        if (len != 42) this.err = { ...this.err, addr: `Invalid address` }
        break
      default:
        if (len < 32) this.err = { ...this.err, addr: `Invalid address` }
        break
    }

    this.addrValid = !this.err.addr
  }

  onInputAddr = (e: CustomEvent) => {
    this.addr = e.detail
    this.err = { ...this.err, addr: '', tx: '' }
    this.validAddrByType()
  }
  saveAddr = () => {
    if (!this.validate() || !this.addrValid) return
    console.info(`save addr of ${this.type}: ${this.addr}`)
    setTimeout(() => (this.mode = ''))
  }

  cancel = () => {
    this.mode = ''
    this.err = { ...this.err, addr: '' }
    this.pending = { ...this.pending, addr: false }
  } */

  get coinType() {
    return { name: this.item.name, coinType: this.item.coinType }
  }

  setAddr = () => {
    this.mode = 'edit'
    // session
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.addr = this.address
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
              ></dui-copy>`,
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
        this.isEditing,
        () => html`<doid-set-record-wallet .name=${this.name} .coin=${this.coinType}></doid-set-record-wallet>`,
        () => html``
      )}`
  }
}
