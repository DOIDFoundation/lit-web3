import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import '@shoelace-style/shoelace/dist/components/button/button'
import '@shoelace-style/shoelace/dist/themes/light.css'
import './dialog'

@customElement('doid-connect-button')
export class DOIDConnectButton extends LitElement {
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
    this.open()
  }

  override render() {
    return html`
      <sl-button @click=${this.open}>Connect</sl-button>
      <!-- Dialog -->
      ${when(this.dialog, () => html`<doid-connect-dialog appName="${this.appName}" @close=${this.close} />`)}
    `
  }
}
