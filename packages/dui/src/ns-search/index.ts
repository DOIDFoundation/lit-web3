import { TailwindElement, html, when, customElement } from '../shared/TailwindElement'
import { property, state } from 'lit/decorators.js'
import { searchStore, StateController } from './state'
import { bridgeStore } from '@lit-web3/ethers/src/useBridge'
import emitter from '@lit-web3/core/src/emitter'
// Components
import '../input/text'
import '../button'

// Style
import style from './index.css'

@customElement('dui-ns-search')
export class duiNsSearch extends TailwindElement(style) {
  bindStore: any = new StateController(this, searchStore)
  bindBridge: any = new StateController(this, bridgeStore)
  @property() placeholder = 'Placeholder'
  @property() text = ''
  @state() keyword = ''
  @state() err: Record<string, string> = { tx: '', keyword: '' }
  @state() pending: Record<string, boolean> = { tx: false, keyword: false }

  async onInputCode(e: any) {
    this.keyword = e.detail
    this.err = { ...this.err, tx: '', keyword: '' }
    const len = this.keyword.length
    // if (len && len < LENs[0]) {
    //   this.err = { ...this.err, keyword: 'Invalid or expired invitation code' }
    // }
  }

  connectedCallback() {
    if (this.text) this.keyword = this.text
    super.connectedCallback()
  }

  validate() {
    if (this.keyword.length < 3) {
      this.err = { ...this.err, keyword: 'Name is too short. Names must be at least 3 characters long' }
    } else {
      this.err = { ...this.err, keyword: '' }
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
  doSearch() {
    if (!bridgeStore.bridge.account) return emitter.emit('connect-wallet')
    if (!this.validate()) return
    // console.info(this.keyword)
  }
  render() {
    return html`<div class="scan-search">
      <dui-input-text
        @input=${this.onInputCode}
        @submit=${this.doSearch}
        value=${this.keyword}
        placeholder=${this.placeholder}
        ?disabled=${this.pending.tx}
      >
        <span slot="label"><slot name="label"></slot></span>
        <span slot="right" class="-mr-1">
          <dui-button @click=${this.doSearch} icon sm class="text-blue-500"
            ><i class="mdi mdi-magnify text-lg"></i
          ></dui-button>
        </span>
        <span slot="msg">
          ${when(
            this.err.keyword,
            () => html`<span class="text-red-500">${this.err.keyword}</span>`,
            () =>
              html`<slot name="msgd"
                ><span class="text-gray-400"
                  >Start looking up an artist or artwork by DOID, e.g. nocreative.doid, 5h.reva.doid/#3</span
                ></slot
              >`
          )}
        </span>
      </dui-input-text>
    </div>`
  }
}
