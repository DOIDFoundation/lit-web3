import { TailwindElement, html, customElement, repeat, property, when } from '@lit-web3/dui/src/shared/TailwindElement'

// Style
import style from './breadcrumb.css?inline'

@customElement('coll-breadcrumb')
export class CollectionBreadcrumb extends TailwindElement(style) {
  @property() items: any[] = []
  @property() class = ''

  connectedCallback() {
    super.connectedCallback()
  }
  render() {
    return html`<div class="inline-flex gap-1 ${this.class}">
      ${repeat(
        this.items,
        (item: any, idx) =>
          html`
            ${when(
              item.url,
              () => html`<a class="text-blue-500" .href=${item.url}>${item.name}</a>`,
              () => html`<span>${item.name}</span>`
            )}
            ${when(idx < this.items.length - 1, () => html`<span class="inline-block mx-1 text-gray-400">/ </span>`)}
          `
      )}
    </div>`
  }
}
