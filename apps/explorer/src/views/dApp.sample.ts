import {
  TailwindElement,
  html,
  customElement,
  state,
  property,
  when,
  repeat
} from '@lit-web3/dui/src/shared/TailwindElement'
import { sleep } from '@lit-web3/ethers/src/utils'
// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/input/pwd'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/link'
import { ipnsBytes, setMainAddrAndIPNS, mainAddressByName } from '@lit-web3/ethers/src/nsResolver'

const logger = (...args: any) => console.info(`[dApp]`, ...args)

@customElement('view-dapp')
export class ViewRestore extends TailwindElement('') {
  @property() name = 'zzzxxx.doid'
  @state() err: any = null
  @state() msgs: any[] = []
  @state() pending = false
  @state() res_DOID_setup = null
  @state() res_DOID_name = ''
  @state() res_DOID_chain_addrs = {}
  @state() tx: any = null
  @state() success = false
  @state() ipns = ''

  get txPending() {
    return this.tx && !this.tx?.ignored
  }

  completeRegist = async (bytes: Array<number | string>, address: string, cid?: string) => {
    const name = this.name
    const mainAddr = address || (await mainAddressByName(name)).toLowerCase()
    try {
      logger('set main address and IPNS:>>', this.ipns)
      if (bytes.length) {
        this.tx = await setMainAddrAndIPNS(name, mainAddr, bytes)
        const success = await this.tx.wait()
        this.success = success
        logger(this.success)
      }

      logger(`query ipns of ${name}:>>`)
      this.ipns = (await ipnsBytes(name)) as string
      if (cid) {
        logger('query chain address:>>', cid)
        const res = await window.DOID.request({ method: 'DOID_chain_address', params: { cid } })
        this.res_DOID_chain_addrs = res
      }
    } catch (e) {
      this.err = e
    }
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
          const { bytes, address, cid } = data
          this.completeRegist(Object.values(bytes), address, cid)
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
        <dui-button class="outlined minor" @click=${this.req_DOID_setup}
          >{ method: 'DOID_setup', params: ['${this.name}'] }</dui-button
        >
        <p class="my-2">Res: ${this.res_DOID_setup || ''}</p>

        <hr class="my-2" />
        <div class="h-6">
          ${when(this.pending, () => html`<i class="mdi mdi-loading"></i>`)}
          <p class="my-2 text-red-600">${this.err}</p>
        </div>

        <hr class="my-2" />
        <div class="my-2">
          <p class="my-2">Received messages:</p>
          <textarea class="w-80 h-32 border">${html`${this.msgs.map((msg) => JSON.stringify(msg))}`}</textarea>
          ${when(this.ipns, () => html`<p class="text-blue-500">${this.ipns}</p>`)}
          ${repeat(
            Object.keys(this.res_DOID_chain_addrs),
            (key) =>
              html`<div class="mt-2 flex flex-col">
                <div>${key}:</div>
                <div class="text-xs text-gray-500 break-normal whitespace-normal">
                  ${this.res_DOID_chain_addrs[key]}
                </div>
              </div>`
          )}
        </div>
      </div>
    </div>`
  }
}
