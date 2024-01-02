import { ThemeElement, html, property, customElement, when } from '@lit-web3/dui/shared/theme-element'
import { goto } from '@lit-web3/router'
// Components
import '@lit-web3/dui/ns-search/entire'

@customElement('search-bar')
export class SearchBar extends ThemeElement('') {
  @property() default?: string
  @property() placeholder = 'DOID of artist or artwork'
  @property({ type: String }) label?: string
  @property({ type: Boolean }) lite = false
  @property({ type: Boolean }) sm = false

  onSearch = (e: CustomEvent) => {
    const { token = {}, uri, name } = e.detail
    if (token.name || token.slugName) goto(`/collection/${uri}`)
    else if (name) goto(`/artist/${uri}`)
  }
  render() {
    return html`<doid-search-entire
      .sm=${this.sm}
      .default=${this.default}
      @search=${this.onSearch}
      placeholder=${this.placeholder}
    >
      ${when(!this.lite && this.label, () => html`<span slot="label">${this.label}</span>`)}
      ${when(this.lite, () => html`<span slot="msg"></span>`)}
    </doid-search-entire>`
  }
}
