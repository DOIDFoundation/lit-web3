import { customElement, TailwindElement, html, property, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
// Components
import '@lit-web3/dui/src/dialog'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/input/text'
import icon from '@lit-web3/ethers/src/wallet/metamask/icon.svg'
import style from './dialog.css?inline'

@customElement('connect-doid-dialog')
export class ConnectDOIDDialog extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Boolean }) model: any
  @property({ type: String }) appName: any
  @state() step = 1

  close() {
    this.remove()
    this.emit('close')
  }

  override render() {
    return html`<dui-dialog @close=${this.close}>
      <div slot="header" class="w-16 mx-auto mt-6 pl-4">
        <doid-icon sm></doid-icon>
      </div>
      <div class="mb-8 -mt-2 text-center font-medium">
        <h1 class="text-2xl mb-4">Welcome</h1>
        ${when(
          this.appName,
          () => html`<p>Unlock your DOID to continue to ${this.appName}.</p>`,
          () => html`<p>Unlock your DOID to continue.</p>`
        )}
      </div>
      <div class="px-6 mt-2 text-center font-medium">
        <div class="button-container">
          <div class="button">
            <img class="m-auto w-5 h-5 mt-1.5 object-contain select-none pointer-events-none" src=${icon} />
          </div>
          <dui-button icon>
            <i class="mdi mdi-google text-xl"></i>
          </dui-button>
          <dui-button icon>
            <i class="mdi mdi-apple text-xl"></i>
          </dui-button>
          <dui-button icon>
            <i class="mdi mdi-facebook text-xl"></i>
          </dui-button>
        </div>
        <div class="separator mt-4"></div>
        <p>
          Don't have a DOID?
          <dui-link class="block">Sign up</dui-link>
        </p>
      </div>
    </dui-dialog>`
  }
}
