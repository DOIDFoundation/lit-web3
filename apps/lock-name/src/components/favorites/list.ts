import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  repeat
} from '@lit-web3/dui/src/shared/TailwindElement'
import { getFavorites } from '@/components/favorites/store'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'
import '@/components/favorites/btn'

import style from './list.css'
@customElement('doid-favorites')
export class ViewFavorites extends TailwindElement(style) {
  @state() favorites: any[] = getFavorites()

  get() {
    this.favorites = getFavorites()
  }

  render() {
    if (!this.favorites.length)
      return html`<div class="text-center">
        <b><i class="mdi mdi-heart-outline text-2xl text-gray-200"></i></b>
        <p class="text-base">No names have been saved</p>
        <p>To add names to favourites, click the heart icon next to any desired name.</p>
      </div>`
    return html`${repeat(
      this.favorites,
      (favored) =>
        html`<div
          @click=${() => goto(`/name/${favored.name}`)}
          class="flex justify-between items-center gap-4 border my-2 p-3 shadow-sm cursor-pointer hover_bg-gray-100 rounded-md"
        >
          <b>${favored.name}</b>
          <div class="flex gap-4 items-center">
            <span class="text-green-500">Available</span>
            <doid-favorites-btn .name=${favored.name} @change=${this.get}></doid-favorites-btn>
          </div>
        </div>`
    )}`
  }
}
