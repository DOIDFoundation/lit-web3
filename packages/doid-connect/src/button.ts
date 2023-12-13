import { customElement, TailwindElement, html, state, when, property } from '@lit-web3/dui/src/shared/TailwindElement'
import emitter from '@lit-web3/core/src/emitter'
import './dialog'

@customElement('doid-connect-button')
export class DOIDConnectButton extends TailwindElement('') {
  @property({ type: String }) appName = ''
  @state() dialog = false

  open = () => {
    this.dialog = true
  }
  close() {
    this.dialog = false
  }

  connectedCallback(): void {
    super.connectedCallback()
    emitter.on('connect-wallet', this.open)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    emitter.off('connect-wallet', this.open)
  }

  override render() {
    return html`
      <dui-button @click=${this.open}>Connect</dui-button>
      <!-- Dialog -->
      ${when(this.dialog, () => html`<doid-connect-dialog appName="${this.appName}" @close=${this.close} />`)}
    `
  }
}
