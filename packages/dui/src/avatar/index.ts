import { customElement, TailwindElement, html, state, when, property } from '../shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import jazzicon from '@metamask/jazzicon'

import style from './avatar.css?inline'
@customElement('dui-avatar')
export class DuiAvatar extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Number }) size = 16

  @state() uri = ''

  get bridge() {
    return bridgeStore.bridge
  }

  get svg() {
    return jazzicon(16, parseInt(this.bridge.account.slice(2, 10), 16))
  }

  override render() {
    return html`${this.svg}`
  }
}
