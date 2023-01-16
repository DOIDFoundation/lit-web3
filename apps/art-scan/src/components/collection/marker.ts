import { TailwindElement, html, customElement, property } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/link'

@customElement('coll-marker')
export class CollMarker extends TailwindElement('') {
  @property() DOID?: DOIDObject

  get doid() {
    return this.DOID?.doid ?? ''
  }
  get tokenish() {
    return this.DOID?.uri?.replace(this.doid, '')
  }

  render() {
    if (this.tokenish)
      return html`<dui-link link href=${`/artist/${this.doid}`}>${this.doid}</dui-link>${this.tokenish}`
    return html`${this.doid}`
  }
}
