import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '~/components/favorites/list'

import style from './favorites.css?inline'
@customElement('view-favorites')
export class ViewFavorites extends TailwindElement(style) {
  render() {
    return html`<div class="view-favorites">
      <div class="dui-container">
        <dui-ns-search
          @search=${(e: CustomEvent) => goto(`/search/${e.detail}`)}
          placeholder="Search DOID names"
        ></dui-ns-search>
        <!-- Favorites -->
        <doid-favorites></doid-favorites>
      </div>
    </div>`
  }
}
