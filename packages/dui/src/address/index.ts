import { customElement, TailwindElement, html, when, property } from '../shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { screenStore } from '@lit-web3/core/src/screen'
import { shortAddress } from '@lit-web3/ethers/src/utils'
// Components
import './avatar'
import '../link'
import '../copy/icon'

import style from './address.css?inline'
@customElement('dui-address')
export class DuiAddress extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  bindScreen: any = new StateController(this, screenStore)
  @property() address?: string // !!! if not defined, use current wallet address
  @property({ type: Boolean }) avatar = false
  @property({ type: Boolean }) copy = false
  @property({ type: Boolean }) short = false // if false, auto short address
  @property() href?: string

  get addr() {
    return typeof this.address === 'string' ? this.address : bridgeStore.bridge.account
  }
  get isLink() {
    return typeof this.href === 'string'
  }
  get showAddr() {
    return this.short || screenStore.screen.isMobi ? shortAddress(this.addr) : this.addr
  }

  override render() {
    return html`${when(
      this.avatar,
      () => html`<dui-address-avatar class="mr-1.5" .address=${this.addr}></dui-address-avatar>`
    )}${when(
      this.isLink,
      () => html`<dui-link href=${this.href}>${this.showAddr}</dui-link>`,
      () => html`${this.showAddr}`
    )}${when(this.copy, () => html`<dui-copy-icon .value=${this.address}></dui-copy-icon>`)}`
  }
}
