import { TailwindElement, html, customElement, property, when, repeat } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import './item'

import style from './list.css?inline'
@customElement('doid-name-list')
export class DoidNameList extends TailwindElement(style) {
  @property() names: NameInfo[] = []
  @property() pending = false
  @property() empty = false

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`<div class="doid-name-list">
      <!-- Pending -->
      ${when(this.pending, () => html`<i class="mdi mdi-loading"></i> Searching...`)}
      <!-- Empty -->
      ${when(this.empty, () => html`No Data`)}
      <!-- List -->
      ${repeat(this.names, (item) => html`<doid-name-item .name=${item}></doid-name-item>`)}
    </div>`
  }
}
