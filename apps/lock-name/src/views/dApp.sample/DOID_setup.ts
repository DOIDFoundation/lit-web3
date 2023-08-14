import { TailwindElement, html, customElement, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { sleep } from '@lit-web3/ethers/src/utils'
// Components
import '@lit-web3/dui/src/button'
// import { ipnsBytes, setMainAddrAndIPNS, mainAddressByName } from '@lit-web3/ethers/src/nsResolver'

const logger = (...args: any) => console.info(`[dApp]`, ...args)

@customElement('dapp-method-doid-setup')
export class dappMethodDoidSetup extends TailwindElement('') {
  @state() name = 'zzzxxx.doid'
  @state() err: any = null
  @state() pending = false
  @state() res_DOID_setup = null
  @state() res_DOID_chain_addrs = null
  @state() tx: any = null
  @state() success = false
  @state() ipns = ''

  get txPending() {
    return this.tx && !this.tx?.ignored
  }

  // completeRegist = async (bytes: Array<number | string>, address: string, cid?: string) => {
  //   const name = this.name
  //   const mainAddr = address || (await mainAddressByName(name)).toLowerCase()
  //   try {
  //     logger('set main address and IPNS:>>', this.ipns)
  //     if (bytes.length) {
  //       this.tx = await setMainAddrAndIPNS(name, mainAddr, bytes)
  //       const success = await this.tx.wait()
  //       this.success = success
  //       logger(this.success)
  //     }

  //     logger(`query ipns of ${name}:>>`)
  //     this.ipns = (await ipnsBytes(name)) as string
  //     if (cid) {
  //       logger('query chain address:>>', cid)
  //       const res = await window.DOID.request({ method: 'DOID_chain_address', params: { cid } })
  //       this.res_DOID_chain_addrs = res
  //     }
  //   } catch (e) {
  //     this.err = e
  //   }
  // }

  req_DOID_setup = async () => {
    this.pending = true
    try {
      this.res_DOID_setup = await window.DOID.request({ method: 'DOID_setup', params: [this.name] })
    } catch (err: any) {
      this.res_DOID_setup = err
    }
    this.pending = false
  }

  async connectedCallback() {
    super.connectedCallback()
    // TODO: Add onboarding service
    await sleep(500)

    // window.DOID?.on('reply_DOID_setup', ({ id, data } = <any>{}) => {
    //   const { bytes, address, cid } = data
    //   this.completeRegist(Object.values(bytes), address, cid)
    // })
  }
  render() {
    return html`<div>
      <dui-button class="outlined minor" @click=${this.req_DOID_setup} ?pending=${this.pending}
        >{ method: 'DOID_setup', params: ['${this.name}'] }</dui-button
      >
      <span class="m-2">res: ${this.res_DOID_setup}</span>
      <p class="mt-1">ipns: ${this.ipns}</p>
      <!-- <p>DOID_chain_address: ${this.res_DOID_chain_addrs}</p> -->
    </div>`
  }
}
