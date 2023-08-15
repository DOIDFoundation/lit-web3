import { customElement, TailwindElement, html, state, when, classMap } from '@lit-web3/dui/src/shared/TailwindElement'
import { uiKeyring, StateController } from '~/store/keyringState'
import { uiConnects } from '~/store/connectState'
import emitter from '@lit-web3/core/src/emitter'
// Components
import '@lit-web3/dui/src/address/avatar'
import '@lit-web3/dui/src/address/name'
import '@lit-web3/dui/src/button'
import './menu'

@customElement('account-connection')
export class AccountSwitch extends TailwindElement(null) {
  bindKeyring: any = new StateController(this, uiKeyring)
  bindConnects: any = new StateController(this, uiConnects)

  @state() menu = false

  get walletSelectedName() {
    return uiKeyring.selectedDOID?.name
  }
  get isConnected() {
    return uiConnects.name === this.walletSelectedName
  }
  get title() {
    if (this.isConnected) return `${uiConnects.name} connected`
    if (this.walletSelectedName) return `${this.walletSelectedName} not connected`
    return 'No accounts connected'
  }

  showConnects = () => {
    emitter.emit('doid-connects-edit')
  }
  onSwitch = () => {
    this.menu = false
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`<div>
      <button @click=${() => this.showConnects()} title=${this.title}>
        <i
          class="text-base mdi ${classMap(
            this.$c([
              this.isConnected
                ? 'mdi-web-check text-teal-600'
                : uiConnects.isConnected
                ? 'mdi-web-cancel'
                : 'mdi-web-cancel text-neutral-400'
            ])
          )}"
        ></i>
      </button>
    </div>`
  }
}
