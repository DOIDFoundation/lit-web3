import { TailwindElement, html, customElement, property, classMap } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '../favorites/btn'

import style from './item.css?inline'
@customElement('doid-name-item')
export class DoidNameItem extends TailwindElement(style) {
  @property() nameInfo!: NameInfo

  goto() {
    const { name, available } = this.nameInfo
    goto(`/name/${name}/${available ? 'register' : 'details'}`)
  }

  change() {
    this.emit('change')
  }

  render() {
    return html`<div class="doid-name-item">
      <div
        @click=${this.goto}
        class="flex justify-between items-center gap-4 border p-3 shadow-sm cursor-pointer bg-gray-50 hover_bg-gray-100 rounded-md"
      >
        <b>${this.nameInfo.name}</b>
        <div class="flex gap-4 items-center">
          <span
            class="${classMap(
              this.$c([
                this.nameInfo.available ? 'text-green-500' : this.nameInfo.registered ? 'opacity-75' : 'text-red-500'
              ])
            )}"
            >${this.nameInfo.stat}</span
          >
          <doid-favorites-btn @change=${this.change} .name=${this.nameInfo.name}></doid-favorites-btn>
        </div>
      </div>
    </div>`
  }
}
