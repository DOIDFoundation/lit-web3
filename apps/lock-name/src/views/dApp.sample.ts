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
  @state() err = ''
  request = async () => {
    this.pending = true
    this.nameAddresses = null as any
    try {
      this.nameAddresses = await window.DOID.request({ method: 'DOID_setup', params: ['zzzxxx.doid'] })
      console.log('resolved nameAddresses', this.nameAddresses)
    } catch (e) {
      this.nameAddresses = { error: 'cancelled' }
    } finally {
      this.pending = false
    }
  }

  onAccountRecover = async () => {
    window.DOID.on('DOID_account_recover', async (data: any) => {
      const {
        data: { cid }
      } = data
      const res = await window.DOID.request({ method: 'DOID_chain_address', params: { cid } })
      this.chainAddresses = res
    })
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
        <dui-button @click=${this.request} .pending=${this.pending}>DOID_name</dui-button>
        <hr class="my-2" />
        <dui-button @click=${this.request} .pending=${this.pending}>DOID_requestName</dui-button>
        <hr class="my-2" />
        <dui-button @click=${this.request} .pending=${this.pending}
          >{ method: 'DOID_setup', params: ['zzzxxx.doid'] }</dui-button
        >
        <hr class="my-2" />
        <dui-button @click=${this.onAccountRecover} .pending=${this.pending}>listen DOID_account_recover</dui-button>
        <pre class="p-4 text-xs text-blue-500 break-words whitespace-normal">
${JSON.stringify(this.chainAddresses, null, '')}</pre
        >
        <hr class="my-2" />
        <pre class="p-4 text-xs">${JSON.stringify(this.nameAddresses, null, '  ')}</pre>
      </div>
    </div>`
  }
}
