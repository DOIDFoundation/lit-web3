import { TailwindElement, html, when, repeat } from '@lit-web3/dui/src/shared/TailwindElement'
import { customElement, property, state } from 'lit/decorators.js'
import emitter from '@lit-web3/core/src/emitter'

// Components
import '@lit-web3/dui/src/input/text'

// Style
import style from './search.css'

@customElement('search-input')
export class searchInput extends TailwindElement(style) {
  @property() text = ''
  @state() keyword = ''
  @state() err: Record<string, string> = { tx: '', keyword: '' }
  @state() pending: Record<string, boolean> = { tx: false, keyword: false }

  async onInputCode(e: CustomEvent) {
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
  }
  render() {
    return html`<div class="scan-search">
      <dui-input-text
        @input=${this.onInputCode}
        value=${this.keyword}
        placeholder="DOID of artist or artwork"
        required
        ?disabled=${this.pending.tx}
      >
        <span slot="label">DOID of artist or artwork</span>
        <span slot="right">
          <p class="flex gap-2" @click=${this.doSearch}>
            <i class="mdi mdi-arrow-right-circle-outline text-blue-500 text-lg"></i>
          </p>
        </span>
        <span slot="msg">
          ${when(
            this.err.keyword,
            () => html`<span class="text-red-500">${this.err.keyword}</span>`,
            () =>
              html`<span class="text-gray-400"
                >Start looking up an artist or artwork by DOID, e.g. nocreative.doid, 5h.reva.doid/#3</span
              >`
          )}
        </span>
      </dui-input-text>
    </div>`
  }
}
