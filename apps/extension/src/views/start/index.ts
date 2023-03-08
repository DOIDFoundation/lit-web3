import { TailwindElement, html, customElement, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import '@lit-web3/dui/src/address'
import '@lit-web3/dui/src/doid-symbol'
import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
import { accountStore, StateController } from '~/store/account'
import { goto } from '@lit-web3/dui/src/shared/router'

import style from './start.css?inline'
@customElement('view-start')
export class ViewStart extends TailwindElement(style) {
  bindStore: any = new StateController(this, accountStore)

  @state() name = ''
  @state() ownerAddress = ''
  @state() mainAddress = ''

  get wrapName() {
    return this.name ? wrapTLD(this.name) : ''
  }

  async getAddressesByName() {
    if (!this.name) return
    const { owner, mainAddress } = await accountStore.search(this.name)
    this.ownerAddress = owner
    this.mainAddress = mainAddress
  }
  gotoRecover = () => {
    goto('/recover')
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
        <div class="mt-48">
          <div class="flex justify-center">
            <dui-link class="link underline mr-2">${this.wrapName}</dui-link>
            ${when(
              this.ownerAddress,
              () => html`
                <div>
                  <span class="text-gray-400 mr-2">is owned by</span>
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
            <dui-button class="w-full" .disabled=${!this.mainAddress} @click=${this.gotoRecover}
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
            <dui-button class="w-full outlined">Cancel</dui-button>
          </div>
        </div>
      </div>
    </div>`
  }
}
