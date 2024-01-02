import { ThemeElement, html, customElement, property, state, classMap } from '@lit-web3/dui/shared/theme-element'
// Components
import '@lit-web3/dui/button'
import { favor, getFavorites, exists } from './store'

import style from './btn.css?inline'

@customElement('doid-favorites-btn')
export class DoidFavoritesBtn extends ThemeElement(style) {
  @property() name = ''
  @state() favorites = getFavorites()

  get favored() {
    return exists(this.name)
  }

  favor = (e: Event) => {
    e.stopImmediatePropagation()
    favor(this.name)
    this.favorites = getFavorites()
    this.emit('change')
  }

  render() {
    if (!this.name) return ''
    return html`<dui-button icon sm part="dui-button" @click=${this.favor}
      ><i
        class="mdi ${classMap(this.$c([this.favored ? 'mdi-heart' : 'mdi-heart-outline', { favored: this.favored }]))}"
      ></i
    ></dui-button>`
  }
}
