import { TailwindElement, html, customElement, property, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
// import { goto } from '@lit-web3/dui/src/shared/router'

// Components
import '@lit-web3/dui/src/edit-address-inline'

import style from './details.css'
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
    return html`
      <div class="px-3 py-4">
        <div class="flex justify-start items-center mb-3">
          <div class="item_key">PARENT</div>
          <div><a href="/name/doid/details" class="text-blue-500">doid</a></div>
        </div>
        <hr class="mb-3 border-t border-dashed border-gray-300" />
        <div class="flex flex-col lg_flex-row justify-start items-start mb-3">
          <div class="item_key">ADDRESS</div>
          <div class="flex flex-col">
            <edit-addr-inline></edit-addr-inline>
            <edit-addr-inline net="BSC"></edit-addr-inline>
            <edit-addr-inline net="OKC"></edit-addr-inline>
          </div>
        </div>
      </div>
    `
  }
}
