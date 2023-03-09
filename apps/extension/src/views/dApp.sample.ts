import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/input/pwd'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/link'

const logger = (...args: any) => console.info(`[dApp]`, ...args)

@customElement('view-dapp')
export class ViewRestore extends TailwindElement('') {
  request = () => {
    window.DOID.request({ method: 'DOID_account' })
    window.DOID.request({ method: 'eth_accounts' })
    logger('request sent')
  }
  render() {
    return html`<div class="sample">
      <div class="dui-container">
        <dui-button @click=${this.request}>request</dui-button>
      </div>
    </div>`
  }
}
