import { customElement, TailwindElement, html, when, state } from './shared/TailwindElement'
import { animate } from '@lit-labs/motion'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
// Components
import './link'

@customElement('network-warning')
export class NetworkWarning extends TailwindElement('') {
  bindBridge: any = new StateController(this, bridgeStore)
  @state() pending = false

  get bridge() {
    return bridgeStore.bridge
  }
  get network() {
    return this.bridge.network
  }
  get txt() {
    if (this.network.unSupported) `Please connect to the Mainnet}.`
    if (this.network.mainnetOffline) return `Mainnet is not supported yet`
    if (!this.network.isMainnet) return `Note: You are currently connected to the ${this.bridge.network.title}`
    return ''
  }
  get shown() {
    return this.network.disabled || !this.network.isMainnet
  }

  async switch() {
    this.pending = true
    await this.bridge.switchNetwork(this.network.default.chainId)
    this.pending = false
  }
  toggle(del = false) {
    const { style } = document.documentElement
    const attr = '--networkWarnH'
    del || !this.shown ? style.removeProperty(attr) : style.setProperty(attr, '24px')
  }

  connectedCallback() {
    this.toggle()
    super.connectedCallback()
  }
  disconnectedCallback(): void {
    this.toggle(true)
    super.disconnectedCallback()
  }

  override render() {
    if (!this.shown) return
    return html`<span
      class="overflow-hidden h-6 w-full flex text-red-600 items-center px-2 justify-center text-center bg-orange-200 ${this
        .shown
        ? 'h-6'
        : 'h-0 opacity-0'}"
      ${animate({ guard: () => this.shown, properties: ['opacity', 'height', 'visibility'] })}
    >
      <span>${this.txt}</span>
      ${when(
        !this.network.isDefaultNet,
        () =>
          html`<dui-link ?disabled=${this.pending} text class="ml-1" @click=${this.switch}
            >Switch to ${this.network.default.title}</dui-link
          >`
      )}
    </span>`
  }
}
