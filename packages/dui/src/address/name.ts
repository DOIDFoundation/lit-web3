import { customElement, TailwindElement, html, property, when } from '../shared/TailwindElement'
import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
import { shortAddress } from '@lit-web3/ethers/src/utils'

// Components
import './avatar'

@customElement('dui-name-address')
export class DuiNameAddress extends TailwindElement(null) {
  @property() name = ''
  @property() address = ''
  @property() DOID?: DOIDObject
  @property({ type: Boolean }) avatar = false
  @property({ type: Boolean }) wrap = false
  @property({ type: Boolean }) short = false

  get #address() {
    return this.DOID?.address ?? this.address
  }
  get #name() {
    return this.DOID?.name ?? this.name
  }

  get empty() {
    return !this.#name || !this.#address
  }
  get addr() {
    return this.#address ?? ''
  }
  get showName() {
    return this.wrap ? wrapTLD(this.#name) : this.#name
  }
  get showAddress() {
    return this.short ? shortAddress(this.#address) : ''
  }

  override render() {
    return html`${when(
      !this.empty,
      () => html`<div class="flex justify-center items-center whitespace-nowrap text-ellipsis">
        ${when(this.avatar, () => html`<dui-address-avatar class="mr-1.5" .address=${this.addr}></dui-address-avatar>`)}
        ${this.showName}
        ${when(this.showAddress, () => html`<span class="text-xs ml-2 opacity-60">${this.showAddress}</span>`)}
      </div>`
    )}`
  }
}
