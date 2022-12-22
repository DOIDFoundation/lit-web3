import { TailwindElement, html, customElement, property, when, state } from '../shared/TailwindElement'

import { unicodelength } from '@lit-web3/ethers/src/stringlength'

// Components
import '../button'
import '../input/text'
import '../copy'

// Style
import style from './index.css'

@customElement('edit-addr-inline')
export class EditInline extends TailwindElement(style) {
  @property({ type: String }) type = 'ETH'
  @property({ type: String }) address = ''

  @state() tip: Record<string, string> = { addr: '' }
  @state() err: Record<string, string> = { addr: '', tx: '' }
  @state() pending: Record<string, boolean> = { addr: false, tx: false }
  @state() addr = ''
  @state() addrValid = false
  @state() mode = ''

  validate = () => {
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
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.addr = this.address
  }

  disconnectedCallback = () => {
    super.disconnectedCallback()
  }

  render() {
    return html`<div class="flex justify-start items-center my-3 ${this.mode}">
      <div class="addr_name text-gray-400">${this.type}</div>
      <div class="grow flex items-center">
        <div class="addr_edit">
          ${when(
            this.mode === 'edit',
            () =>
              html` <dui-input-text
                value=${this.addr}
                class="sm"
                @input=${this.onInputAddr}
                ?disabled=${this.pending.tx}
                ><span slot="msg"
                  >${when(
                    this.err.addr,
                    () => html`<span class="text-red-500">${this.err.addr}</span>`,
                    () => html``
                  )}</span
                ></dui-input-text
              >`,
            () =>
              html`${when(
                this.address,
                () =>
                  html`${this.address}<dui-copy .value=${this.address} sm icon class=""
                      ><span slot="copied" class="text-green-500">
                        <i class="mdi mdi-check-circle-outline"></i>
                      </span>
                      <span slot="copy"><i class="mdi mdi-content-copy"></i></span
                    ></dui-copy>`,
                () => html`<span class="text-gray-400">No set</span>`
              )}`
          )}
        </div>
        ${when(
          this.mode === 'edit',
          () =>
            html`<dui-button sm text class="ml-1 outlined" @click=${this.saveAddr}>Save</dui-button
              ><dui-button sm text class="ml-1 outlined" @click=${this.cancel}>Cancel</dui-button>`,
          () =>
            html`<dui-button sm icon class="ml-1"
              ><i class="mdi mdi-pencil-outline" @click=${() => (this.mode = 'edit')}></i
            ></dui-button>`
        )}
      </div>
    </div>`
  }
}
