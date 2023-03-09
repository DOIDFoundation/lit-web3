import { TailwindElement, html, customElement, property, when } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '~/components/collection/marker'
import '~/components/collection/list'
import '~/components/collection/item'
// Style
import style from './index.css?inline'

@customElement('view-collection')
export class ViewCollection extends TailwindElement(style) {
  @property() DOID?: DOIDObject

  get tokenName() {
    return this.DOID?.token?.name
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`<div class="view-collection">
      <div class="dui-container">
        <coll-marker .DOID=${this.DOID} class="block mb-6"></coll-marker>
        ${when(
          this.tokenName,
          () => html`<!-- collection -->
            <doid-collection .DOID=${this.DOID}></doid-collection>`,
          () => html`<!-- artist's collections -->
            <doid-collections .DOID=${this.DOID}></doid-collections>`
        )}
      </div>
    </div>`
  }
}
