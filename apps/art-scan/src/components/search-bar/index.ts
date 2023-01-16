import { TailwindElement, html, property, customElement, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '@lit-web3/dui/src/ns-search/entire'

// Style
import style from './search-bar.css?inline'
@customElement('search-bar')
export class SearchBar extends TailwindElement(style) {
  @property() default?: string
  @property() placeholder = 'DOID of artist or artwork'
  @property({ type: String }) label?: string
  @property({ type: Boolean }) lite = false

  onSearch = (e: CustomEvent) => {
    const { token, uri, name } = e.detail
    if (token.name || token.slugName) goto(`/collection/${uri}`)
    else if (name) goto(`/artist/${uri}`)
  }
  render() {
    return html`<doid-search-entire .default=${this.default} @search=${this.onSearch} placeholder=${this.placeholder}>
      ${when(!this.lite && this.label, () => html`<span slot="label">${this.label}</span>`)}
      ${when(this.lite, () => html`<span slot="msg"></span>`)}
    </doid-search-entire>`
  }
}
