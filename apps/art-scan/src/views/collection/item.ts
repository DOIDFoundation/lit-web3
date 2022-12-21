import { TailwindElement, html, customElement, styleMap, when } from '@lit-web3/dui/src/shared/TailwindElement'

import { property, state } from 'lit/decorators.js'

// Components
import style from './item.css?inline'

@customElement('coll-item')
export class CollItem extends TailwindElement(style) {
  @property({ type: Object }) item: any = {}

  render() {
    return html`<div class="coll-item">
      <p>
        collection.xxx.doid
        ${when(
          this.item.token_id.length > 30,
          () => html``,
          () => html`<span class="ml-2 text-base">#${this.item.token_id}</span>`
        )}
      </p>
      <div class="w-full flex flex-row gap-4">
        <div class="poster" style=${styleMap({ backgroundImage: `url(${this.item.image})` })}>
          <!-- <img class="object-contain" src=${this.item.image} /> -->
        </div>
        <div class="shrink">
          <div class="mb-1 text-base">${this.item.name}</div>
          <div class="text-xs text-gray-400 break-all">${this.item.description}</div>
        </div>
      </div>
      <p class="text-gray-500">
        Minted on <span>${this.item.createAt}</span> Owned by <span>${this.item.username}</span>
      </p>
    </div>`
  }
}
