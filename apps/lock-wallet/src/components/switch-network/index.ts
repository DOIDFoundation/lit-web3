import { customElement, ThemeElement, html, state, repeat, when, classMap } from '@lit-web3/dui/shared/theme-element'
// import { bridgeStore, StateController } from '../../ethers/useBridge'
// import emitter from '@lit-web3/base/emitter'
import { Networks } from '~/ethers/networks'
import { SupportNetworks } from '~/ethers/constants/networks'
import { bridgeStore, StateController } from '~/ethers/useBridge'
// Components
import '@lit-web3/dui/menu/drop'

import style from './index.css?inline'
@customElement('switch-network')
export class switchNetwork extends ThemeElement(style) {
  bindBridge = new StateController(this, bridgeStore)
  @state() menu = false
  @state() pending = false
  @state() promptMsg = ''
  @state() promptTitle = ''
  get networks() {
    return Object.values(Networks)
  }
  get bridge() {
    return bridgeStore.bridge
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
  async switch(network: NetworkInfo) {
    if (!SupportNetworks.includes(network.chainId)) return
    this.menu = false
    this.pending = true
    try {
      await this.bridge.switchNetwork(network.chainId)
    } catch (err: any) {
      if (err.code !== 4001) {
        console.warn('switch network failed with error:', err)
        this.promptTitle = 'Switch network failed'
        this.promptMsg = err.details ?? err.message
      }
    }
    this.pending = false
  }
  render() {
    return html`
    <dui-drop
        .show=${this.menu}
        @change=${(e: CustomEvent) => (this.menu = e.detail)}
        icon
        btnSm
        btnText
        dropClass="w-12"
        btnClass="text"
      >
        <div slot="button" class="inline-flex justify-center items-center">
        <i class="token-icon ${classMap(this.$c([this.native?.symbol]))}"></i>
        </div>
        <ul class="dui-option">

          ${repeat(
      this.networks,
      (network) =>
        html`
            <li @click="${() => this.switch(network)}" class="text-base  ${classMap({ active: network.chainId === this.current.chainId, 'bg-gray-50 !cursor-not-allowed': !SupportNetworks.includes(network.chainId) })}"><i class="token-icon ${classMap(this.$c([network.native?.symbol]))}"></i>
                ${network.title}</li>
            `
    )}
        </ul>
    </dui-drop>`
  }
}
