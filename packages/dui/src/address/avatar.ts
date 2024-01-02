import { customElement, ThemeElement, html, property } from '../shared/theme-element'
import jazzicon from '@metamask/jazzicon'

import style from './avatar.css?inline'
@customElement('ui-address-avatar')
export class UIAddressAvatar extends ThemeElement(style) {
  @property({ type: Number }) size = 16
  @property({ type: String }) address = ''

  get svg() {
    const svg = jazzicon(this.size, parseInt(this.address.slice(2, 10), 16)).querySelector('svg')
    if (!svg) return ''
    svg.removeAttribute('width')
    svg.removeAttribute('height')
    svg.setAttribute('viewBox', `0 0 ${this.size} ${this.size}`)
    return svg
  }

  override render() {
    if (!this.address) return ''
    return html`${this.svg}`
  }
}
