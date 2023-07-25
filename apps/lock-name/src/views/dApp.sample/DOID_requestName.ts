import { TailwindElement, html, customElement, state, classMap } from '@lit-web3/dui/src/shared/TailwindElement'
import { sleep } from '@lit-web3/ethers/src/utils'
// Components
import '@lit-web3/dui/src/button'

@customElement('dapp-method-doid-requestname')
export class dappMethodDoidRequestname extends TailwindElement('') {
  @state() res_DOID_requestName = ''
  @state() pending = false
  @state() res_DOID_name = ''
  @state() pending2 = false

  req_DOID_requestName = async () => {
    this.pending = true
    this.res_DOID_requestName = ''
    try {
      this.res_DOID_requestName = JSON.stringify(await window.DOID.request({ method: 'DOID_requestName', params: [] }))
    } catch (err: any) {
      this.res_DOID_requestName = err
    }
    this.pending = false
  }

  namePolling = async () => {
    this.pending2 = true
    try {
      this.res_DOID_name = JSON.stringify(await window.DOID.request({ method: 'DOID_name', params: [] }))
    } catch {}
    this.pending2 = false
    await sleep(3000)
    this.namePolling()
  }

  async connectedCallback() {
    super.connectedCallback()
    // TODO: Add onboarding service
    this.namePolling()
  }
  render() {
    return html`<div>
      <dui-button class="outlined minor" @click=${this.req_DOID_requestName} ?pending=${this.pending}
        >{ method: 'DOID_requestName' }</dui-button
      >

      <span class="m-2">res: ${this.res_DOID_requestName}</span>

      <p class="mt-2">
        { method: 'DOID_name' } polling res: ${this.res_DOID_name}
        <i class="mdi ${classMap({ 'mdi-loading': this.pending2 })}"></i>
      </p>
    </div>`
  }
}
