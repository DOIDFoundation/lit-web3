import { TailwindElement, html, customElement, property, when, keyed } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '~/components/collection/list'
import '~/components/artist/info'
// Styles
import style from './index.css?inline'

@customElement('view-artist')
export class ViewArtist extends TailwindElement(style) {
  @property() DOID?: DOIDObject

  get doid() {
    return this.DOID?.doid
  }

  render() {
    return html`<div class="view-artist">
      <div class="dui-container">
        ${when(
          this.doid,
          () =>
            html`${keyed(
              this.doid,
              html`<div class="grid-cols-1 lg_grid-cols-6 grid gap-4 lg_gap-8">
                <div class="lg_col-span-4 order-2 lg_order-none">
                  <doid-collections .DOID=${this.DOID}></doid-collections>
                </div>
                <div class="lg_col-span-2 bg-gray-100 h-32 p-4 order-1 lg_order-none rounded-md lg_sticky top-4">
                  <artist-info .DOID=${this.DOID}></artist-info>
                </div>
              </div>`
            )}`
        )}
      </div>
    </div>`
  }
}
