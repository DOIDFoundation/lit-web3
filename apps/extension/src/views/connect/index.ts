import { TailwindElement, html, customElement, property } from '@lit-web3/dui/src/shared/TailwindElement'
import popupMessenger from '~/lib.next/messenger/popup'

// Components
// import '@lit-web3/dui/src/menu'

import style from './connect.css?inline'
import { AddressType, getAddress } from '~/lib.legacy/phrase'

@customElement('view-connect')
export class ViewUnlock extends TailwindElement(style) {
  @property()
  mnemonic = 'oven busy immense pitch embrace same edge leave bubble focus denial ripple'

  @property()
  doidName = 'zzzxxx'

  onConnect = async () => {
    let addresses = await getAddress(this.mnemonic)
    console.log(addresses)
    // if (!addresses || !this.account.name) return
    try {
      const res = await popupMessenger.send('internal_connect', {
        doid: this.doidName,
        mnemonic: this.mnemonic
      })
      console.info('res:', res)
    } catch (e) {
      popupMessenger.log(e)
    }
  }

  render() {
    return html`
      <div class="connect">
        <div class="border-b">
          <div class="relative px-4">
            <div
              class="h-10 border cursor-pointer border-gray-300 rounded-md text-base bg-white px-4  flex justify-between items-center"
            >
              <span>https://opensea.io</span>
              <i class="mdi mdi-chevron-down"></i>
            </div>
            <!-- <dui-button class="inline-flex items-center">ethers</dui-button> -->
          </div>
          <div class="py-3 text-center">Connect with DOID</div>
        </div>
        <div class="dui-container px-4">
          <div class="font-bold py-4 text-lg">Select DOID to use on this site</div>
          <div class="font-bold text-lg">Chain:</div>
          <div
            class="h-10 border cursor-pointer border-gray-300 rounded-md text-base bg-white px-4 flex justify-between items-center mt-1"
          >
            <span class="">Ehtereum</span>
            <i class="mdi mdi-chevron-down"></i>
          </div>
          <div class="font-bold text-lg mt-4">DOID:</div>
          <div
            class="h-10 border cursor-pointer border-gray-300 rounded-md text-base bg-white px-4 flex justify-between items-center mt-1"
          >
            <span class="">satoshi.doid</span>
            <i class="mdi mdi-chevron-down"></i>
          </div>
        </div>

        <!-- bottom -->
        <div class="p-4 fixed bottom-0">
          <div>Only connect with sites you trust</div>
          <div class="mt-2 flex">
            <dui-button class="outlined">Cancel</dui-button>
            <!-- <dui-button class="ml-2" onclick="${() => this.onConnect()}">Connect</dui-button> -->
            <dui-button class="ml-2" @click=${() => this.onConnect()}>Connect</dui-button>
          </div>
        </div>
      </div>
    `
  }
}
