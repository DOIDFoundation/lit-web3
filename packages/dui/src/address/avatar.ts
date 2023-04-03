import { customElement, TailwindElement, html, property } from '../shared/TailwindElement'
import jazzicon from '@metamask/jazzicon'

import style from './avatar.css?inline'
@customElement('dui-address-avatar')
export class DuiAddressAvatar extends TailwindElement(style) {
  @property({ type: Number }) size = 16
  @property({ type: String }) address = ''

  get svg() {
    return jazzicon(this.size, parseInt(this.address.slice(2, 10), 16))
  }

  override render() {
    return html`${this.address ? this.svg : ''}`
  }
}
