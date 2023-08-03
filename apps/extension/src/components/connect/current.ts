import { TailwindElement, html, customElement, property, state, repeat } from '@lit-web3/dui/src/shared/TailwindElement'
import popupMessenger from '~/lib.next/messenger/popup'
import { uiKeyring, StateController } from '~/store/keyringState'

// Components
// import '@lit-web3/dui/src/menu'
import '@lit-web3/dui/src/address/name'
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/menu/drop'
import { chainsDefault } from '~/lib.next/chain'

import style from './connect.css?inline'

@customElement('view-connect')
export class ViewUnlock extends TailwindElement(style) {
  bindKeyring: any = new StateController(this, uiKeyring)
  @property() host = ''
  @property() chain = ''
  @state() names: Record<string, boolean> = {}

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

  get selectNames() {
    const names = this.names
    const res = Object.keys(names).filter((k) => names[k] === true)
    return res
  }

  get = async () => {
    this.headers = await popupMessenger.send('internal_headers')
  }

  connect = async () => {
    if (!this.selectNames.length) return
    try {
      const res = await popupMessenger.send('internal_connect', {
        names: this.selectNames,
        host: this.host,
        chain: this.chain
      })
      if (res === 'ok') this.close()
    } catch (e) {
      console.error(e)
    }
  }

  select = (name: string) => {
    this.names[name] = !this.names[name]
  }

  close = () => {
    window.close()
  }

  connectedCallback() {
    super.connectedCallback()
    this.names = Object.fromEntries(this.DOIDs.map((r) => [r.name, false]))
    this.get()
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
              <img class="w-5 h-5" src=${this.favicon} />
              <span>${this.host}</span>
            </div>
            <!-- <dui-button class="inline-flex items-center">ethers</dui-button> -->
          </div>
          <!-- Title -->
          <div class="mt-4 mb-8 text-center">
            <strong class="text-xl font-bold">Connect with DOID</strong>
            <div class="mt-1 text-xs">Select DOID to use on this site</div>
          </div>
          <!-- Accounts -->
          <p class="mt-4 flex justify-between">
            <span>Select:</span>
            <dui-link href="/create">New Account</dui-link>
          </p>
          <ul class="border rounded-md mt-2 mb-4">
            ${repeat(
              this.DOIDs,
              (DOID) =>
                html`<li @click=${() => this.select(DOID.name)} class="flex items-center p-4 gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    class="cursor-pointer"
                    .checked=${(this.names[DOID.name] as boolean) || ''}
                    readonly
                  /><dui-name-address .DOID=${DOID} short></dui-name-address>
                </li>`
            )}
          </ul>
          <!-- Chain -->
          <div>
            <strong class="my-4 font-semibold">Chain:</strong>
            <span class="">${this.Chain?.title}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="py-2 fixed w-full bottom-0 text-center">
          <p class="text-xs">Only connect with sites you trust</p>
          <div class="mt-2 border-t p-4 flex justify-center gap-8">
            <dui-button @click=${this.close} class="outlined minor">Cancel</dui-button>
            <dui-button class="secondary" @click=${this.connect}>Connect</dui-button>
          </div>
        </div>
      </div>
    `
  }
}
