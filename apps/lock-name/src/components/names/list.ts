import { TailwindElement, html, customElement, property, when, repeat } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import './item'

import style from './list.css?inline'
@customElement('doid-name-list')
export class DoidNameList extends TailwindElement(style) {
  @property() names: NameInfo[] = []
  @property() pending = false
  @property() empty = false

  change() {
    this.emit('change')
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`<div class="doid-name-list">
      <!-- Pending -->
      ${when(this.pending, () => html`<i class="mdi mdi-loading"></i> Searching...`)}
      <!-- Empty -->
      ${when(this.empty, () => html`<p class="px-3">No Data yet.</p>`)}
      <!-- List -->
      <div class="flex flex-col gap-2">
        ${repeat(
          this.names,
          (info) => html`<doid-name-item @change=${this.change} .nameInfo=${info}></doid-name-item>`
        )}
      </div>
    </div>`
  }
}
