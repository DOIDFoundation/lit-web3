import { TailwindElement, html, customElement, state, when } from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/button'
import { goto } from '@lit-web3/dui/src/shared/router'
import { getAccount } from '~/lib.legacy/account'

import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'

@customElement('view-landing')
export class ViewLanding extends TailwindElement(null) {
  @state() name = ''
  @state() ownerAddress = ''
  @state() mainAddress = ''

  get wrapName() {
    return wrapTLD(this.name)
  }
  getInfo = () => {
    //TODO: get from DOID object
    const { name, owner } = getAccount()
    this.name = name
    this.ownerAddress = owner
  }
  connectedCallback() {
    this.getInfo()
    super.connectedCallback()
  }
  render() {
    return html`<div class="dapp-landing">
      <div class="dui-container">
        <doid-symbol class="block mt-12"> </doid-symbol>
        <div class="my-4 text-md">
          Setting up main address for
          <dui-link class="link ml-1 underline">${this.name}</dui-link>
        </div>
        <div class="mt-6 my-10 text-gray-400">
          Main addresses are the default addresses of your DOID on all chains. They are generaged automatically with one
          single easy setup and will not change until you modify them.
        </div>

        <dui-button class="outlined w-full my-2" @click=${() => goto('/generate-phrase/1')}
          >Generate main address for all chains for me</dui-button
        >
        ${when(
          this.ownerAddress && !this.mainAddress,
          () => html`<dui-button class="outlined w-full my-2" @click=${() => goto('/import2nd')}
              >Use <dui-address class="mx-1" .address=${this.ownerAddress}></dui-address> as main address for ETH, main
              addresses for all other chains will be generated automaticaly
            </dui-button>
            <div class="my-2 text-center">or</div>`
        )}

        <dui-button class="outlined w-full my-2" @click=${() => goto(`/import3rd`)}
          >Use a Secret Recovery Phrase to generate main addresses for all chains</dui-button
        >
      </div>
    </div>`
  }
}
