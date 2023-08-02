import {
  customElement,
  TailwindElement,
  html,
  state,
  when,
  classMap,
  repeat
} from '@lit-web3/dui/src/shared/TailwindElement'
import { uiKeyring, StateController } from '~/store/keyringState'
import { uiConnects } from '~/store/connectState'
import popupMessenger from '~/lib.next/messenger/popup'
import emitter from '@lit-web3/core/src/emitter'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/dialog'

@customElement('connects-guard')
export class AccountSwitch extends TailwindElement(null) {
  bindKeyring: any = new StateController(this, uiKeyring)
  bindConnects: any = new StateController(this, uiConnects)

  @state() dialog = false

  get name() {
    return uiKeyring.selectedDOID?.name
  }
  get connectUri() {
    return `/connect/${encodeURIComponent(uiConnects.host)}`
  }

  edit = () => {
    this.dialog = true
  }

  close() {
    this.dialog = false
  }
  goto(uri: string) {
    goto(uri)
    this.close()
  }

  async disconnect(name: string) {
    const { host } = uiConnects
    await popupMessenger.send('internal_connects_set', { host, name })
  }
  async select(name: string) {
    await popupMessenger.send('internal_selectDOID', { name })
  }

  connectedCallback() {
    super.connectedCallback()
    emitter.on('doid-connects-edit', this.edit)
  }

  render() {
    if (!this.dialog) return ''
    return html`<dui-dialog @close=${this.close}>
      <div slot="header">
        <strong>${uiConnects.host}</strong>
        <p class="text-xs mt-1">
          ${uiConnects.isConnected ? `You have ${uiConnects.isConnected} accounts connected to this site.` : ``}
        </p>
      </div>
      ${when(
        uiConnects.isConnected,
        () => html`<ul class="border-t-2">
            ${repeat(
              uiConnects.names,
              (name) =>
                html`<li class="flex justify-between items-center gap-2 border-b-2 p-2">
                  <div class="flex-grow">
                    <div class="flex items-center gap-2">
                      <strong>${name}</strong>
                    </div>
                    <div>
                      ${when(
                        this.name === name,
                        //  Current
                        () => html`<i class="text-xs text-gray-400">Active</i>`,
                        //  Others
                        () => html`<dui-link @click=${() => this.select(name)}>Switch to this account</dui-link>`
                      )}
                    </div>
                  </div>
                  <p>
                    <dui-button sm @click=${() => this.disconnect(name)} icon
                      ><i class="mdi mdi-web-minus text-base" title="Disconnect this account"></i
                    ></dui-button>
                  </p>
                </li>`
            )}
          </ul>
          <div class="mt-2">
            <b class="block my-1">Permissions</b>
            <p class="text-xs">You have authorized the following permissions:</p>
            <p class="text-xs">See address, account balance, activity and suggest transactions to approve</p>
          </div>`,
        () =>
          html`DOID is not connected to this site. To connect to a web3 site, please find and click the connect button.
            <div class="border-t-2 pt-2 mt-2">
              <dui-link @click=${() => this.goto(this.connectUri)}>Manually connect to this site</dui-link>
            </div>`
      )}
    </dui-dialog>`
  }
}
