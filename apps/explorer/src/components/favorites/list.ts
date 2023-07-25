import { TailwindElement, html, customElement, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { getFavorites } from '~/components/favorites/store'
import { nameInfo } from '@lit-web3/ethers/src/nsResolver'
// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'
import '~/components/favorites/btn'
import '~/components/names/list'

import style from './list.css?inline'
@customElement('doid-favorites')
export class DoidFavorites extends TailwindElement(style) {
  @state() favorites = getFavorites()
  @state() names: NameInfo[] = []
  @state() pending = false
  @state() ts = 0

  get empty() {
    return !this.pending && !this.names.length
  }

  get = async () => {
    this.pending = true
    this.favorites = getFavorites()
    this.names = await nameInfo(this.favorites.map((r: FavorName) => r.name))
    this.pending = false
    this.ts++
  }

  connectedCallback() {
    super.connectedCallback()
    this.get()
  }

  render() {
    if (!this.favorites.length)
      return html`<div class="text-center my-4">
        <b class="block my-4"><i class="mdi mdi-heart-outline text-2xl text-gray-200"></i></b>
        <p class="text-base">No names have been favorited</p>
        <p>To add names to favorites, click the heart icon next to any desired name.</p>
      </div>`
    return html`
      <!-- Names -->
      <doid-name-list
        @change=${this.get}
        .names=${this.names}
        .pending=${!this.ts && this.pending}
        .empty=${this.empty}
      ></doid-name-list>
    `
  }
}
