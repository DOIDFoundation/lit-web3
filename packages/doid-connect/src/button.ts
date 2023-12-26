import { LitElement, html, CSSResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import '@shoelace-style/shoelace/dist/components/button/button'
import './connectDialog'
import { options } from './options'
import { DOIDConnectDialog } from './connectDialog'

@customElement('doid-connect-button')
export class DOIDConnectButton extends LitElement {
  @property({ type: String }) appName = ''
  @state() dialog = false

  static styles = DOIDConnectDialog.styles

  connectedCallback(): void {
    super.connectedCallback()
    if (this.appName) options.appName = this.appName
  }

  open = () => {
    this.dialog = true
  }
  close() {
    this.dialog = false
  }

  override render() {
    return html`
      <sl-button @click=${this.open} class="${options.themeMode == 'dark' ? 'sl-theme-dark' : 'sl-theme-light'}"
        >Connect</sl-button
      >
      <!-- Dialog -->
      ${when(this.dialog, () => html`<doid-connect-dialog @close=${this.close}></doid-connect-dialog>`)}
    `
  }
}
