import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  repeat
} from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '@/components/favorites/list'

import style from './favorites.css?inline'
@customElement('view-favorites')
export class ViewFavorites extends TailwindElement(style) {
  render() {
    return html`<div class="view-favorites">
      <div class="dui-container px-3 my-8">
        <doid-favorites></doid-favorites>
      </div>
    </div>`
  }
}
