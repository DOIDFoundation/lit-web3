import { TailwindElement, html, when, customElement } from '../shared/TailwindElement'
import { property, state } from 'lit/decorators.js'
import { searchStore, StateController } from './store'
import { bridgeStore } from '@lit-web3/ethers/src/useBridge'
import emitter from '@lit-web3/core/src/emitter'
import { check, wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
// Components
import '../input/text'
import '../button'

// Style
import style from './index.css?inline'
@customElement('dui-ns-search')
export class duiNsSearch extends TailwindElement(style) {
  bindStore: any = new StateController(this, searchStore)
  bindBridge: any = new StateController(this, bridgeStore)
  @property() placeholder = ''
  @property() min = 2
  @property() text: string | undefined
  @state() keyword = ''
  @state() err = ''
  @state() pending: Record<string, boolean> = { tx: false, keyword: false }
  @state() checkedKeyword: Record<string, unknown> = {}

  onInput = (e: CustomEvent) => {
    let val = e.detail
    let err = ''
    if (val.length < this.min) {
      err = `Name is too short. Names must be at least ${this.min} characters long`
    } else {
      this.checkedKeyword = check(val)
      if (this.checkedKeyword.error) err = 'Invalid Names or Addresses'
    }
    this.err = err
    if (!this.err) {
    }
    this.keyword = val
  }

  doSearch() {
    if (!bridgeStore.bridge.account) return emitter.emit('connect-wallet')
    if (this.err) return
    if (this.checkedKeyword.name) this.keyword = wrapTLD(this.keyword)
    this.emit('search', this.keyword)
  }

  connectedCallback() {
    if (typeof this.text !== 'undefined') this.keyword = this.text
    super.connectedCallback()
  }

  render() {
    return html`
      <dui-input-text
        class="scan-search"
        @input=${this.onInput}
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
            this.err,
            () => html`<span class="text-red-500">${this.err}</span>`,
            () =>
              html`<slot name="msgd"
                ><span class="text-gray-400"
                  >Start looking up an artist or artwork by DOID, e.g. nocreative.doid, 5h.reva.doid/#3</span
                ></slot
              >`
          )}
        </span>
      </dui-input-text>
    `
  }
}
