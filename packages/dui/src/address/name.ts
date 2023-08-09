import { customElement, TailwindElement, html, property, when, classMap } from '../shared/TailwindElement'
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
  @property({ type: Boolean }) col = false

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
    if (this.empty) return ''
    return html`<span
      class="flex justify-center items-center whitespace-nowrap text-ellipsis ${classMap(
        this.$c([this.col ? 'gap-2' : 'gap-1.5'])
      )}"
    >
      ${when(
        this.avatar,
        () => html`<dui-address-avatar size=${this.col ? 21 : 16} .address=${this.addr}></dui-address-avatar>`
      )}
      <span class="flex ${classMap(this.$c([this.col ? 'flex-col gap-1' : 'gap-2 items-center']))}"
        ><span>${this.showName}</span>${when(
          this.showAddress,
          () => html`<span class="text-xs opacity-60 ${classMap({ block: this.col })}">${this.showAddress}</span>`
        )}</span
      >
    </span>`
  }
}
