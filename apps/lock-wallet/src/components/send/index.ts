import { customElement, ThemeElement, html, state, repeat, when, classMap } from '@lit-web3/dui/shared/theme-element'
import { bridgeStore, StateController, getNativeBalance, getContract, getBridgeProvider, getWalletAccount } from '~/ethers/useBridge'
import { parseEther } from 'ethers'

import style from './index.css?inline'


@customElement('send-div')
export class Send extends ThemeElement(style) {
  bindBridge = new StateController(this, bridgeStore)
  @state() nativeBalance = '0'

  get account() {
    return bridgeStore.bridge.account
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
      <div @click=${() => this.send()}>send</div>
    `
  }
}
