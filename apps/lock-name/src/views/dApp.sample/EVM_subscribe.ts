import { TailwindElement, html, customElement, state, property } from '@lit-web3/dui/src/shared/TailwindElement'
import { sleep } from '@lit-web3/ethers/src/utils'
// Components
import '@lit-web3/dui/src/input/text'

// Style
import style from './sample.css?inline'

@customElement('dapp-method-evm-subcribe')
export class dappMethodEVMSubcribe extends TailwindElement(style) {
  @property() name = ''
  @property() chainId = ''
  @state() err: any = null
  @state() msgs: any[] = []
  @state() pending = false
  @state() tx: any = null
  @state() success = false
  @state() ipns = ''

  async connectedCallback() {
    super.connectedCallback()
    // TODO: Add onboarding service
    await sleep(500)
    ;['accountsChanged', 'chainChanged'].forEach((_evt) => {
      window.ethereum?.on(_evt, (data: any) => {
        this.msgs = [data].concat(this.msgs)
      })
    })
  }
  render() {
    return html`<div class="my-2">
      <p class="my-2">EVM received messages:</p>
      <textarea class="w-96 h-32 border">${html`${this.msgs.map((msg) => JSON.stringify(msg) + '\n')}`}</textarea>
    </div>`
  }
}
