import { TailwindElement, html, customElement, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import '@lit-web3/dui/src/address'
import '@lit-web3/dui/src/doid-symbol'
import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
import { accountStore, StateController } from '~/store/account'
import { goto } from '@lit-web3/dui/src/shared/router'

@customElement('view-start')
export class ViewStart extends TailwindElement(null) {
  bindStore: any = new StateController(this, accountStore)

  @state() name = ''
  @state() ownerAddress = ''
  @state() mainAddress = ''
  @state() pending = false

  get wrapName() {
    return this.name ? wrapTLD(this.name) : ''
  }

  async getAddressesByName() {
    this.pending = true
    this.name = accountStore.account.name
    if (!this.name) return
    const { owner, mainAddress } = accountStore.account
    this.ownerAddress = owner
    this.mainAddress = mainAddress
    this.pending = false
  }

  cancel() {
    history.back()
  }

  connectedCallback() {
    this.getAddressesByName()
    super.connectedCallback()
  }
  render() {
    return html`<div class="view-start">
      <div class="dui-container">
        <doid-symbol>
          <span slot="h1">YOUR DECENTRALIZED OPENID</span>
          <div class="mt-2 w-7/12 mx-auto text-xs" slot="msg">
            Safer, faster and easier entrance to chains, contacts and dApps
          </div>
        </doid-symbol>
        <div class="mt-16">
          ${when(
            this.pending,
            () => html`<div class="flex justify-center"><i class="text-2xl mdi mdi-loading"></i></div>`,
            () => html`
              <div class="flex justify-center">
                <dui-link text class="uri">${this.wrapName}</dui-link>
                ${when(
                  this.ownerAddress,
                  () => html`
                    <div>
                      <span class="text-gray-400 mx-2">is owned by</span>
                      <dui-address .address=${this.ownerAddress} short></dui-address>
                    </div>
                  `
                )}
              </div>
              ${when(
                this.ownerAddress,
                () => html`
                  <div class="flex justify-center">
                    <span class="text-gray-400 mr-2">and managed by</span>
                    <dui-address .address=${this.mainAddress} short></dui-address>
                  </div>
                `
              )}
              <div class="mt-10 flex flex-col gap-2">
                <dui-button class="w-full" .disabled=${!this.mainAddress} @click=${() => goto('/recover')}
                  >Manage
                  ${when(
                    this.mainAddress,
                    () => html` with (<dui-address .address=${this.mainAddress} short></dui-address>)`
                  )}</dui-button
                >
                <dui-button class="w-full" .disabled=${!this.ownerAddress || true}
                  >Reset
                  ${when(
                    this.ownerAddress,
                    () => html` with owner (<dui-address .address=${this.ownerAddress} short></dui-address>)`
                  )}</dui-button
                >
                <dui-button @click=${this.cancel} class="w-full outlined">Cancel</dui-button>
              </div>
            `
          )}
        </div>
      </div>
    </div>`
  }
}
