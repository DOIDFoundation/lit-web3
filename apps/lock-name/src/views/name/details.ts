import { TailwindElement, html, customElement, property, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components

import style from './details.css?inline'
@customElement('view-name-details')
export class ViewNameDetails extends TailwindElement(style) {
  @property() name = ''

  @state() pending = false
  @state() ts = 0

  get empty() {
    return false
  }

  get = async () => {
    this.ts++
  }

  connectedCallback() {
    this.get()
    super.connectedCallback()
  }

  render() {
    return html`<div class="px-3">Details for ${this.name}</div>`
  }
}
