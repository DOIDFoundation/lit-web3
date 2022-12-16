import { TailwindElement, html, when, customElement } from '../shared/TailwindElement'
import { property, state } from 'lit/decorators.js'
import { searchStore, StateController } from './state'

// Components
import '../input/text'

// Style
import style from './index.css'

@customElement('dui-ns-search')
export class duiNsSearch extends TailwindElement(style) {
  bindStore: any = new StateController(this, searchStore)
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
    super.connectedCallback()
    if (this.text) this.keyword = this.text
  }

  validate() {
    if (!this.keyword) {
      this.err = { ...this.err, keyword: 'Required' }
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
    if (!this.validate()) return
    // console.info(this.keyword)
  }
  render() {
    return html`<div class="scan-search">
      <dui-input-text
        @input=${this.onInputCode}
        value=${this.keyword}
        placeholder=${this.placeholder}
        required
        ?disabled=${this.pending.tx}
      >
        <span slot="label"><slot name="label"></slot></span>

        <span slot="right">
          <slot name="right">
            <p class="flex gap-2">
              <i class="mdi mdi-arrow-right-circle-outline text-blue-500 text-lg" @click=${this.doSearch}></i>
            </p>
          </slot>
        </span>
        <span slot="msg">
          ${when(
            this.err.keyword,
            () => html`<span class="text-red-500">${this.err.keyword}</span>`,
            () =>
              html`<slot name="msgd"></slot
                ><span class="text-gray-400"
                  >Start looking up an artist or artwork by DOID, e.g. nocreative.doid, 5h.reva.doid/#3</span
                >`
          )}
        </span>
      </dui-input-text>
    </div>`
  }
}
