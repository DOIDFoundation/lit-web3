import { TailwindElement, html, customElement, state, repeat } from '@lit-web3/dui/src/shared/TailwindElement'
// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/input/pwd'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/link'

const logger = (...args: any) => console.info(`[dApp]`, ...args)

@customElement('view-dapp')
export class ViewRestore extends TailwindElement('') {
  @state() err: any = null
  @state() msgs: any[] = []
  @state() pending = false
  @state() res_DOID_setup = null
  @state() res_DOID_name = null

  reset = () => {
    this.err = null
    this.pending = true
  }

  req = window.DOID.request

  req_DOID_setup = async () => {
    this.reset()
    try {
      this.res_DOID_setup = await this.req({ method: 'DOID_setup', params: ['zzzxxx.doid'] })
    } catch (e) {
      this.err = e
    }
    this.pending = false
  }

  req_DOID_name = async () => {
    this.reset()
    try {
      this.res_DOID_name = await this.req({ method: 'DOID_name', params: [] })
    } catch (e) {
      this.err = e
    }
    this.pending = false
  }

  async connectedCallback() {
    super.connectedCallback()
    // TODO: Add onboarding service
    ;['DOID_account_change', 'DOID_account_update'].forEach((_evt) => {
      window.DOID.on(_evt, ({ id, data } = <any>{}) => {
        this.msgs = this.msgs.concat([{ id, data }])
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
          >{ method: 'DOID_setup', params: ['zzzxxx.doid'] }</dui-button
        >
        <p class="my-2">Res: ${this.res_DOID_setup || ''}</p>

        <hr class="my-2" />
        <div class="my-2">
          <p class="my-2">Received messages:</p>
          <textarea class="w-80 h-32 border">${repeat(this.msgs, (msg) => html`${JSON.stringify(msg)}`)}</textarea>
        </div>

        <hr class="my-2" />
        <p class="my-2 text-red-600">${this.err}</p>
      </div>
    </div>`
  }
}
