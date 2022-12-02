import { customElement, TailwindElement, html, state, when } from '../shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
// import emitter from '@lit-web3/core/src/emitter'
// Components
import { DuiButton } from '../button'
import './dialog'

import style from './btn.css'
@customElement('connect-wallet-btn')
// @ts-ignore
export class ConnectWalletBtn extends TailwindElement([DuiButton.styles, style]) {
  bindStore: any = new StateController(this, bridgeStore)

  @state() dialog = false

  show() {
    this.dialog = true
  }
  close() {
    this.dialog = false
  }

  override render() {
    return html`
      <dui-button sm @click="${this.show}"> ${bridgeStore.bridge.shortAccount || 'Connect Wallet'} </dui-button>
      ${when(this.dialog, () => html`<connect-wallet-dialog @close=${this.close}></connect-wallet-dialog>`)}
    `
  }
}
