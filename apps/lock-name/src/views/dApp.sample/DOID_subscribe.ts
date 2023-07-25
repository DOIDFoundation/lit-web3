import { TailwindElement, html, customElement, state, property } from '@lit-web3/dui/src/shared/TailwindElement'
import { sleep } from '@lit-web3/ethers/src/utils'
// Components
import '@lit-web3/dui/src/input/text'

// Style
import style from './sample.css?inline'

@customElement('dapp-method-doid-subcribe')
export class dappMethodDoidSubcribe extends TailwindElement(style) {
  @property() name = 'zzzxxx.doid'
  @state() err: any = null
  @state() msgs: any[] = []
  @state() pending = false
  @state() res_DOID_setup = null
  @state() res_DOID_chain_addrs: Record<string, string> = {}
  @state() tx: any = null
  @state() success = false
  @state() ipns = ''

  async connectedCallback() {
    super.connectedCallback()
    // TODO: Add onboarding service
    await sleep(500)
    ;['DOID_account_change', 'DOID_account_update', 'reply_DOID_setup'].forEach((_evt) => {
      window.DOID?.on(_evt, ({ id, data } = <any>{}) => {
        this.msgs = this.msgs.concat([{ id, data }])
      })
    })
  }
  render() {
    return html`<div class="my-2">
      <p class="my-2">{ method: 'DOID_subscribe' } received messages:</p>
      <textarea class="w-80 h-32 border">${html`${this.msgs.map((msg) => JSON.stringify(msg))}`}</textarea>
    </div>`
  }
}
