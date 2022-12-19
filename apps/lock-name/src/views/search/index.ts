import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  repeat
} from '@lit-web3/dui/src/shared/TailwindElement'
import emitter from '@lit-web3/core/src/emitter'
import { searchStore, StateController } from '@lit-web3/dui/src/ns-search/store'
// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'

import style from './search.css'
@customElement('view-search')
export class ViewSearch extends TailwindElement(style) {
  bindStore: any = new StateController(this, searchStore)
  @property() keyword = ''
  @state() names: unknown[] = []

  get empty() {
    return !this.names.length
  }

  search = async (e?: CustomEvent) => {
    const keyword = e?.detail ?? this.keyword
    const res = await searchStore.search(keyword)
    this.names = [keyword]
    console.log(res)
    // this.goto(`/search/${keyword}`)
  }
  goto(path: string) {
    emitter.emit('router-goto', path)
  }

  connectedCallback() {
    this.search()
    super.connectedCallback()
  }

  render() {
    return html`<div class="view-search">
      <div class="dui-container">
        <dui-ns-search .text=${this.keyword} @search=${this.search} placeholder="Search name or addresses">
          <span slot="label"></span>
          <span slot="msgd"></span>
        </dui-ns-search>
        ${when(
          searchStore.pending,
          () => html`<i class="mdi mdi-loading"></i> Searching...`,
          () =>
            html`${when(
              this.empty,
              () => html`No Data`,
              () =>
                html`${repeat(
                  this.names,
                  (name) =>
                    html`<div
                      @click=${() => this.goto(`/name/${name}`)}
                      class="border p-3 shadow-sm cursor-pointer hover_bg-gray-100 rounded-md"
                    >
                      ${name}
                    </div>`
                )}`
            )}`
        )}
      </div>
    </div>`
  }
}
