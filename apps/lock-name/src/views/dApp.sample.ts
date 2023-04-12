import { TailwindElement, html, customElement, state } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/input/pwd'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/link'

const logger = (...args: any) => console.info(`[dApp]`, ...args)

@customElement('view-dapp')
export class ViewRestore extends TailwindElement('') {
  @state() nameAddresses = {}
  @state() pending = false
  @state() chainAddresses = {}
  request = async () => {
    this.pending = true
    this.nameAddresses = {}
    try {
      // const res = await window.DOID.request({ method: 'eth_requestAccounts' })
      // console.log(res)
      this.nameAddresses = await window.DOID.request({ method: 'DOID_setup', params: ['zzzxxx.doid'] })
      console.log('resolved nameAddresses', this.nameAddresses)
      await window.DOID.on('DOID_account_update', (e: any) => {
        console.info('[chain addresses]: ', e)
      })
    } catch (e) {
      this.nameAddresses = { error: 'cancelled' }
    }
    this.pending = false
  }
  async connectedCallback() {
    super.connectedCallback()
    // TODO: Add onboarding service
    await 0
    window.DOID.on('DOID_account_change', () => {
      console.log('DOID_account_change')
    })
  }
  render() {
    return html`<div class="sample">
      <div class="dui-container">
        <dui-button @click=${this.request}>DOID_name</dui-button>
        <hr class="my-2" />
        <dui-button @click=${this.request}>DOID_requestName</dui-button>
        <hr class="my-2" />
        <dui-button @click=${this.request} .pending=${this.pending}
          >{ method: 'DOID_setup', params: ['zzzxxx.doid'] }</dui-button
        >
        <hr class="my-2" />
        <pre class="p-4 text-xs">${JSON.stringify(this.nameAddresses, null, '  ')}</pre>
      </div>
    </div>`
  }
}
