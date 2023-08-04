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
import './hostInfo'

@customElement('connects-guard')
export class AccountSwitch extends TailwindElement(null) {
  bindKeyring: any = new StateController(this, uiKeyring)
  bindConnects: any = new StateController(this, uiConnects)

  @state() dialog = false
  @state() permissions = false

  get name() {
    return uiConnects.name
  }
  get names(): string[] {
    const names = [...uiConnects.names]
    const walletSelectedName = uiKeyring.selectedDOID?.name
    if (walletSelectedName && !names.includes(walletSelectedName)) names.unshift(walletSelectedName)
    return names
  }

  edit = () => {
    this.dialog = true
  }

  close() {
    this.dialog = false
  }
  go2connect() {
    goto(`/connect/${encodeURIComponent(uiConnects.host)}`)
    this.close()
  }
  togglePermissions() {
    this.permissions = !this.permissions
  }

  async disconnect(name: string) {
    const { host } = uiConnects
    await popupMessenger.send('internal_connects_set', { host, name })
  }
  async select(name: string) {
    const { host } = uiConnects
    await popupMessenger.send('internal_connects_select', { host, name })
  }

  connectedCallback() {
    super.connectedCallback()
    emitter.on('doid-connects-edit', this.edit)
  }

  render() {
    if (!this.dialog) return ''
    return html`<dui-dialog @close=${this.close}>
      <div slot="header">
        <connect-host-info></connect-host-info>
        <p class="text-xs mt-2">
          ${uiConnects.isConnected ? `You have ${uiConnects.isConnected} accounts connected to this site.` : ``}
        </p>
      </div>
      ${when(
        uiConnects.isConnected,
        () => html`<ul class="">
          ${repeat(
            this.names,
            (name, i) =>
              html`<li class="flex justify-between items-center gap-2 border-t-2 p-2">
                <div class="flex-grow">
                  <div class="flex items-center gap-2">
                    <strong>${name}</strong>
                  </div>
                  <div>
                    ${when(
                      this.name === name,
                      //  Current
                      () => html`<span class="text-xs text-gray-500">Active</span>`,
                      //  Others
                      () =>
                        html`<dui-link @click=${() => this.select(name)}
                          >${i === 0 && this.name !== name
                            ? 'Connect to this account'
                            : 'Switch to this account'}</dui-link
                        >`
                    )}
                  </div>
                </div>
                <p>
                  ${when(
                    !(i === 0 && this.name !== name),
                    () => html`<dui-button sm @click=${() => this.disconnect(name)} icon
                      ><i class="mdi mdi-web-minus text-base" title="Disconnect this account"></i
                    ></dui-button>`
                  )}
                </p>
              </li>`
          )}
        </ul>`
      )}
      ${when(
        !uiConnects.isConnected,
        () =>
          html`<p>
            DOID is not connected to this site. To connect to a web3 site, please find and click the connect button.
          </p>`
      )}
      <div slot="bottom" class="p-4">
        <div class="p-2 border-t-2 text-center">
          <dui-link @click=${() => this.go2connect()}>Manage connections to this site</dui-link>
        </div>
        ${when(
          uiConnects.isConnected,
          () => html`<div class="pt-3 px-2 border-t-2">
            <p @click=${this.togglePermissions} class="flex justify-between items-center cursor-pointer">
              <b class="block">Permissions</b
              ><i
                class="text-2xl leading-none mdi ${classMap(
                  this.$c([this.permissions ? 'mdi-chevron-up' : 'mdi-chevron-down'])
                )}"
              ></i>
            </p>
            <div class="overflow-hidden transition-all ${classMap(this.$c([this.permissions ? 'h-14' : 'h-0']))}">
              <p class="text-xs">You have authorized the following permissions:</p>
              <p class="mt-1 pl-5 text-xs">
                <i class="-ml-5 w-5 inline-block text-gray-400 mdi mdi-checkbox-marked"></i>See address, account
                balance, activity and suggest transactions to approve
              </p>
            </div>
          </div>`
        )}
      </div>
    </dui-dialog>`
  }
}
