import { TailwindElement, html, customElement, state, property } from '@lit-web3/dui/src/shared/TailwindElement'
import { sleep } from '@lit-web3/ethers/src/utils'
// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/input/pwd'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/link'
import { ipnsBytes, setMainAddrAndIPNS, mainAddressByName, address } from '@lit-web3/ethers/src/nsResolver'

const logger = (...args: any) => console.info(`[dApp]`, ...args)

@customElement('view-dapp')
export class ViewRestore extends TailwindElement('') {
  @property() name = 'zzzxxx.doid'
  @state() err: any = null
  @state() msgs: any[] = []
  @state() pending = false
  @state() res_DOID_setup = null
  @state() res_DOID_name = ''
  @state() res_DOID_chain_addrs = null

  completeRegist = async (bytes: Array<number | string>, address: string) => {
    const name = this.name
    const mainAddr = address || (await mainAddressByName(name)).toLowerCase()
    debugger
    const res = await setMainAddrAndIPNS(name, mainAddr, bytes)
    logger('set main address and ipns:\n', res)
  }

  reset = () => {
    this.err = null
    this.pending = true
  }

  req_DOID_setup = async () => {
    this.reset()
    try {
      this.res_DOID_setup = await window.DOID.request({ method: 'DOID_setup', params: [this.name] })
    } catch (e) {
      this.err = e
    }
    this.pending = false
  }

  req_DOID_name = async () => {
    this.reset()
    try {
      this.res_DOID_name = JSON.stringify(await window.DOID.request({ method: 'DOID_name', params: [] }))
    } catch (e) {
      this.err = e
    }
    this.pending = false
  }

  async connectedCallback() {
    super.connectedCallback()
    // TODO: Add onboarding service
    await sleep(500)
    ;['DOID_account_change', 'DOID_account_update', 'reply_DOID_setup'].forEach((_evt) => {
      window.DOID?.on(_evt, ({ id, data } = <any>{}) => {
        this.msgs = this.msgs.concat([{ id, data }])
        if (_evt === 'reply_DOID_setup') {
          const { bytes, address } = data
          this.completeRegist(Object.values(bytes), address)
        }
      })
    })
  }
  render() {
    return html`<div class="sample">
      <div class="dui-container text-sm">
        <dui-button class="outlined minor" @click=${this.req_DOID_name}>{ method: 'DOID_name' }</dui-button>
        <p class="my-2">Res: ${this.res_DOID_name || ''}</p>

        <hr class="my-2" />
        <dui-button class="outlined minor" @click=${this.req_DOID_setup} .pending=${this.pending}
          >{ method: 'DOID_setup', params: ['${this.name}'] }</dui-button
        >
        <p class="my-2">Res: ${this.res_DOID_setup || ''}</p>

        <hr class="my-2" />
        <div class="my-2">
          <p class="my-2">Received messages:</p>
          <textarea class="w-80 h-32 border">${html`${this.msgs.map((msg) => JSON.stringify(msg))}`}</textarea>
        </div>

        <hr class="my-2" />
        <p class="my-2 text-red-600">${this.err}</p>
      </div>
    </div>`
  }
}
