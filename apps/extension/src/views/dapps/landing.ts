import { TailwindElement, html, customElement, state, when } from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/button'
import { goto } from '@lit-web3/dui/src/shared/router'

import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
import { accountStore, StateController } from '~/store/account'

@customElement('view-landing')
export class ViewLanding extends TailwindElement(null) {
  bindStore: any = new StateController(this, accountStore)

  @state() name = ''
  @state() ownerAddress = ''
  @state() pending = false

  get wrapName() {
    return wrapTLD(this.name)
  }

  async getAddressesByName() {
    if (!this.name) return
    this.pending = true
    const { owner, mainAddress } = await accountStore.search(this.name, true)
    // uncomment this when mainAddress is read from IPFS
    // if (mainAddress) goto(`/start`)
    this.ownerAddress = owner
    this.pending = false
  }
  connectedCallback() {
    this.getAddressesByName()
    super.connectedCallback()
  }
  render() {
    return html`<div class="dapp-landing">
      <div class="dui-container">
        <doid-symbol sm class="block mt-12"></doid-symbol>
        <div class="my-4 text-xs">
          Setting up main addresses for
          <dui-link class="uri ml-1 underline">${this.wrapName}</dui-link>
        </div>
        <div class="mt-4 my-7 text-xs text-gray-400">
          Main addresses are the default addresses of your DOID on all chains. They are generated automatically with one
          single easy setup and will not change until you modify them.
        </div>
        ${when(
          this.pending,
          () => html`<div class="flex justify-center"><i class="text-2xl mdi mdi-loading"></i></div>`,
          () => html`<dui-button class="outlined w-full my-2" @click=${() => goto('/generate-phrase/1')}
              >Generate main addresses for all chains for me</dui-button
            >
            <dui-button class="outlined w-full my-2" @click=${() => goto(`/import2nd`)}
              >Use owner address(<dui-address class="mx-1" .address=${this.ownerAddress}></dui-address>) as main address
              for ETH, main addresses for all other chains will be generated automatically</dui-button
            >
            <p class="my-1 text-center text-gray-500">or</p>
            <dui-button class="outlined w-full my-2" @click=${() => goto(`/import`)}
              >Use a Secret Recovery Phrase to generate main addresses for all chains</dui-button
            >`
        )}
      </div>
    </div>`
  }
}
