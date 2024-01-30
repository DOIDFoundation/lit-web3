import { ThemeElement, html, customElement, state } from '@lit-web3/dui/shared/theme-element'
import { bridgeStore, StateController, getNativeBalance, getContract, getBridgeProvider } from '~/ethers/useBridge'
import { goto } from '@lit-web3/router'
// Components
import '~/components/tokenlist/index'
import style from './home.css?inline'
@customElement('view-home')
export class ViewHome extends ThemeElement(style) {
  bindBridge = new StateController(this, bridgeStore)
  @state() nativeBalance = '0'
  gotoSend = () => {
    goto(`/send`)
  }
  gotoReceive = () => {
    goto(`/receive`)
  }
  get bridge() {
    return bridgeStore.bridge
  }
  get account() {
    return bridgeStore.bridge.account
  }
  get network() {
    return this.bridge.network
  }
  get current() {
    return this.network.current
  }
  get native() {
    return this.current?.native
  }
  get addr() {
    return bridgeStore.bridge?.shortAccount
  }
  async getNativeBalance() {
    if (this.account) {
      this.nativeBalance = await getNativeBalance(this.account)
    } else {
      this.nativeBalance = '0'
    }
  }
  connectedCallback(): void {
    super.connectedCallback()
    this.getNativeBalance()
    console.log(this.network);

  }
  render() {
    return html`<div class="home pt-10  min-h-[600px]">
      <div class="text-center">
        <div class="inline-block rounded-full bg-blue-100 px-4 py-2 cursor-pointer">
          <span>${this.addr}</span>
          <i class="mdi mdi-content-copy ml-2"></i>
        </div>
      </div>
      <div class="text-center text-gray-500 mt-3">Balance</div>
      <div class="mt-1 font-bold text-lg text-center">
        ${this.nativeBalance}
        <span>${this.native?.symbol}</span>
      </div>
      <div class="mt-6">
        <div class="flex justify-center">
          <div class="px-2">
            <div class="rounded-full bg-violet-100 p-3 cursor-pointer" @click="${() => this.gotoSend()}">
              <div class="w-6 h-6 flex justify-center items-center"><i class="mdi mdi-arrow-up-thick text-lg"></i></div>

            </div>
            <div class="text-center mt-2">Send</div>
          </div>
          <div class="px-2">
            <div class="rounded-full bg-green-100 p-3 cursor-pointer" @click="${() => this.gotoReceive()}">
              <div class="w-6 h-6 flex justify-center items-center"><i class="mdi mdi-arrow-down-thick text-lg"></i></div>
            </div>
            <div class="text-center mt-2">Receive</div>
          </div>
        </div>
        <div class="border-t my-10"></div>
        <div>
          <div class="grid grid-cols-3 gap-2 text-center"><div class="border-b border-blue-600 font-bold py-2">Tokens</div></div>
          <div class="mt-3">
            <token-list></token-list>
          </div>
        </div>
      </div>
    </div>`
  }
}
