import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  repeat,
  when,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import popupMessenger from '~/lib.next/messenger/popup'
import { uiKeyring, StateController } from '~/store/keyringState'
import { uiConnects } from '~/store/connectState'
import { chainsDefault } from '~/lib.next/chain'

// Components
// import '@lit-web3/dui/src/menu'
import '@lit-web3/dui/src/address/name'
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/menu/drop'
import '~/components/connect/hostInfo'

import style from './connect.css?inline'

@customElement('view-connect')
export class ViewUnlock extends TailwindElement(style) {
  bindKeyring: any = new StateController(this, uiKeyring)
  bindConnects: any = new StateController(this, uiConnects)
  @property() host = ''
  @property() chain = ''
  @state() names: Record<string, boolean> = {} // user selected names

  @state() headers: any

  get DOIDs() {
    return Object.values(uiKeyring.DOIDs ?? {})
  }
  get selectedDOID() {
    return uiKeyring.selectedDOID
  }
  get favicon() {
    return `https://${this.host}/favicon.ico`
  }
  get Chain() {
    return chainsDefault.find((r: any) => r.name === this.chain)
  }
  get selectedNames() {
    return Object.keys(this.names).filter((k) => this.names[k] === true)
  }
  get isAllSelected() {
    return this.selectedNames.length === this.DOIDs.length
  }

  connect = async () => {
    try {
      const res = await popupMessenger.send('internal_connect', {
        names: this.selectedNames,
        host: this.host,
        chain: this.chain
      })
      console.log(res, '??')
      if (res === 'ok') this.close()
    } catch (e) {
      console.error(e)
      debugger
    }
  }

  select = (name: string) => {
    this.names = { ...this.names, [name]: !this.names[name] }
  }

  selectAll = () => {
    for (let name in this.names) this.names[name] = !this.isAllSelected
    this.names = { ...this.names }
  }

  sync = async () => {
    this.names = Object.fromEntries(this.DOIDs.map((r) => [r.name, uiConnects.names.includes(r.name)]))
    this.headers = await popupMessenger.send('internal_headers')
  }

  close = () => {
    if (history.length > 2) return history.back()
    window.close()
  }

  connectedCallback() {
    super.connectedCallback()
    this.sync()
  }

  render() {
    return html`
      <div class="connect">
        <div class="dui-container sparse">
          <!-- Host -->
          <div class="text-center">
            <div
              class="border border-gray-300 rounded-full bg-white p-3 px-4 gap-2 inline-flex justify-center items-center"
            >
              <connect-host-info></connect-host-info>
            </div>
            <!-- <dui-button class="inline-flex items-center">ethers</dui-button> -->
          </div>
          <!-- Title -->
          <div class="mt-4 mb-8 text-center">
            <strong class="text-xl font-bold">Connect with DOID</strong>
            <div class="mt-1 text-xs">Select DOID to use on this site</div>
          </div>
          <!-- Accounts -->
          <p class="mt-4 px-2 flex justify-between">
            <span @click=${this.selectAll} class="inline-flex items-center ml-2.5 gap-2 cursor-pointer select-none"
              ><input type="checkbox" class="pointer-events-none" .checked=${this.isAllSelected} readonly /><span
                class="text-xs"
                >Select all</span
              ></span
            >
            <dui-link href="/create">New DOID</dui-link>
          </p>
          <div class="border rounded-md my-2 max-h-64 overflow-x-hidden overflow-y-auto">
            <ul class="">
              ${repeat(
                this.DOIDs,
                (DOID) =>
                  html`<li
                    @click=${() => this.select(DOID.name)}
                    class="flex items-center p-3 px-4 gap-3 border-t cursor-pointer first_border-t-0 border-gray-200 border-dashed hover_bg-slate-100 ${classMap(
                      { 'font-bold bg-slate-50': this.selectedDOID?.name === DOID.name }
                    )}"
                  >
                    <input type="checkbox" class="pointer-events-none" .checked=${this.names[DOID.name]} readonly />
                    <dui-name-address .DOID=${DOID} short avatar col></dui-name-address>
                  </li>`
              )}
            </ul>
          </div>
          <!-- Chain -->
          ${when(
            this.chain,
            () => html`<p class="my-4">
              <strong>Request Chain:</strong>
              <span class="">${this.Chain?.title}</span>
            </p>`
          )}
        </div>

        <!-- Actions -->
        <div class="py-2 fixed w-full bottom-0 text-center">
          <p class="text-xs">Only connect with sites you trust</p>
          <div class="mt-2 border-t p-4 flex justify-center gap-8">
            <dui-button @click=${this.close} class="outlined minor">Cancel</dui-button>
            <dui-button class="secondary" @click=${this.connect}>Confirm</dui-button>
          </div>
        </div>
      </div>
    `
  }
}
