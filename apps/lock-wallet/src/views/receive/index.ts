import { customElement, ThemeElement, html, state, ref, when, property } from '@lit-web3/dui/shared/theme-element'
import { bridgeStore, StateController, getNativeBalance, getContract, getBridgeProvider, getWalletAccount } from '~/ethers/useBridge'
import qrcode from 'qrcode'
import { goto } from '@lit-web3/router'
import style from './index.css?inline'

@customElement('view-receive')
export class Receive extends ThemeElement(style) {
  bindBridge = new StateController(this, bridgeStore)
  @state() qr = ''
  get addr() {
    return bridgeStore.bridge?.shortAccount
  }
  get account() {
    return bridgeStore.bridge.account
  }
  async genQr() {
    if (this.account)
      this.qr = await qrcode.toDataURL(this.account)
    else
      this.qr = ''
  }
  gotoHome() {
    goto(`/`)
  }
  connectedCallback(): void {
    super.connectedCallback()
    this.genQr()
    console.log(this.qr);

  }
  render() {
    return html`
      <div class="py-2 min-h-[600px]">
        <div class="text-center font-bold">
          <i class="mdi mdi-arrow-left text-lg cursor-pointer" @click="${() => this.gotoHome()}"></i>
          <span class="text-lg  ml-2">Receive</span>
        </div>
        <div class="mt-4">
          <div class="font-bold text-center">Receive Assets on Ethereum</div>
          <div class="bg-gray-100 rounded-lg flex flex-col justify-center items-center p-4 mt-4">
            <div class="w-36 rounded-md border border-black h-36 flex justify-center items-center">
              ${when(this.qr, () => html`<img src="${this.qr}"/>`, () => html`<div>Loading...</div>`)}
            </div>
            <div class="inline-block rounded-full bg-blue-100 px-4 py-2 cursor-pointer mt-4">
              <span>${this.account}</span>
              <i class="mdi mdi-content-copy ml-2"></i>
            </div>
          </div>

        </div>
      </div>
    `
  }
}
