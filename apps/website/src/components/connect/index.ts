import { ThemeElement, html, customElement, when, state, keyed } from '@lit-web3/dui/shared/theme-element'
import { DOIDConnectorEthers } from '@doid/connect-ethers'
import { doid } from '@doid/connect'

import style from './style.css?inline'
@customElement('connect-btn')
export class ConnectBtn extends ThemeElement(style) {
  @state() doidName = ''
  @state() account = ''
  private doidConnectorEthers = new DOIDConnectorEthers(this)

  get chainId() {
    return `0x${(+doid.id).toString(16)}`
  }

  doConnect = async (e: CustomEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const { doid: curName, account } = await this.doidConnectorEthers.connect({ chainId: Number(this.chainId) })
      this.doidName = curName
      this.account = account ?? ''
    } catch (e) {
      console.error(e)
    }
  }

  async connectedCallback() {
    super.connectedCallback()
    this.doidConnectorEthers.updateOptions({ themeMode: 'dark' })
  }

  render() {
    return html`${keyed(
      `${this.chainId}-${this.doidName}-${this.account}`,
      html`<div class="mt-8 lg_mt-10 text-center w-dialog">
        ${when(
          this.doidName?.length,
          () => html`<div class="btn connect-btn">Hi, ${this.doidName}</div>`,
          () =>
            html`<button class="btn connect-btn hoverable" @click=${(e: CustomEvent) => this.doConnect(e)}>
              Get Your DOID
            </button>`
        )}
      </div>`
    )} `
  }
}
