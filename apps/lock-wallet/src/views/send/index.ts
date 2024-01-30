import { customElement, ThemeElement, html, state, ref, when, property } from '@lit-web3/dui/shared/theme-element'
import { bridgeStore, StateController, getNativeBalance, getContract, getBridgeProvider, getWalletAccount } from '~/ethers/useBridge'

import { parseEther } from 'ethers'
import { goto } from '@lit-web3/router'
import '@lit-web3/dui/input/text'
import '@lit-web3/dui/button/index'
import style from './index.css?inline'


@customElement('view-send')
export class Send extends ThemeElement(style) {
  bindBridge = new StateController(this, bridgeStore)
  @property({ type: String }) token = ''
  @property() placeholder = 'Recipient address'
  @property() default?: string
  @property({ type: Boolean }) entire = false
  @state() toAddress = ''
  @state() err = ''
  @state() pending = false
  @state() nativeBalance = '0'

  get account() {
    return bridgeStore.bridge.account
  }

  get network() {
    return bridgeStore.bridge.network
  }
  get current() {
    return this.network.current
  }
  get native() {
    return this.current?.native
  }
  // get isNative(){
  //   return this.token == this.native.symbol
  // }
  get tokenName() {
    if (!this.token || this.token == this.native.symbol) {
      return this.native.symbol
    }
    return this.token
  }
  gotoHome() {
    goto(`/`)
  }
  onInput = async (e: CustomEvent) => {
    // const { val, error, msg } = await this.validateDOIDName(e)
    // this.err = msg
    // if (error) return
    this.toAddress = e.detail
  }
  async send() {
    const v = 1.5
    const val = parseEther(v.toString())
    console.log('0x' + val.toString(16))
    if (window.ethereum) {
      const params = [
        {
          from: '0x54D52253E5f7b375DE24aBF66f6553763Ada566b',
          to: '0x54D52253E5f7b375DE24aBF66f6553763Ada566b',
          // gas: '0x76c0', // 30400
          // gasPrice: '0x9184e72a000', // 10000000000000
          value: val.toString(16),
          // data:
          //   '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
        },
      ];
      window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params,
        })
        .then((result: any) => {
          console.log(result, '---');
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }
  connectedCallback(): void {
    super.connectedCallback()
  }
  render() {
    return html`
      <div class="py-2 min-h-[600px]">
        <div class="text-center font-bold">
          <i class="mdi mdi-arrow-left text-lg cursor-pointer" @click="${() => this.gotoHome()}"></i>
          <span class="text-lg  ml-2">Send</span>
        </div>
        <div class="mt-4">
          <div>
            <dui-input-text
              @input=${this.onInput}
              value=${this.toAddress}
              placeholder=${this.placeholder}
              ?disabled=${this.pending}
            >
            <span slot="label"><div class="text-gray-300">Send to</div></slot></span>
              <!-- <span slot="msg">
                ${when(
      this.err,
      () => html`<span class="text-red-500">${this.err}</span>`,
      () => html`<slot name="msg"></slot>`
    )}
              </span> -->
          </dui-input-text>
          </div>
          <div class="flex justify-between">
            <div class="pl-2 text-gray-300">Amount</div>
            <div>Max:0 ETH</div>
          </div>
          <div class="flex -mt-4">
            <div class="basis-1/3 py-5 flex pr-4">
              <div class="rounded-md border border-gray-500 flex items-center px-2 w-full">
              <div class="rounded-full border  p-2 w-8 h-8 flex justify-center items-center">
                <i class="token-icon ETH"></i>
              </div>
                <div class="mx-2">ETH</div>
                <div><i class="mdi mdi-menu-down"></i></div>
              </div>
            </div>
            <div class="basis-2/3">
              <dui-input-text
                  @input=${this.onInput}
                  value=${this.toAddress}
                  placeholder="amount"
                  ?disabled=${this.pending}
                >
                </dui-input-text>
            </div>
          </div>

          <div class="mt-4">
            <dui-button class="w-full">Send</dui-button>
          </div>
        </div>
      </div>
    `
  }
}
