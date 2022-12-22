import { TailwindElement, html, customElement, property, classMap } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '../favorites/btn'

import style from './list.css?inline'
@customElement('doid-name-item')
export class DoidNameItem extends TailwindElement(style) {
  @property() name!: NameInfo

  goto() {
    const { name, available } = this.name
    goto(`/name/${name}/${available ? 'register' : 'details'}`)
  }

  render() {
    return html`<div class="doid-name-item">
      <div
        @click=${this.goto}
        class="flex justify-between items-center gap-4 border p-3 shadow-sm cursor-pointer hover_bg-gray-100 rounded-md"
      >
        <b>${this.name.name}</b>
        <div class="flex gap-4 items-center">
          <span class="${classMap(this.$c([this.name.available ? 'text-green-500' : 'text-red-500']))}"
            >${this.name.available ? 'Available' : 'Unavailable'}</span
          >
          <doid-favorites-btn .name=${this.name.name}></doid-favorites-btn>
        </div>
      </div>
    </div>`
  }
}
