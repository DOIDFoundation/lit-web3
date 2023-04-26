import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
// import { goto } from '@lit-web3/dui/src/shared/router/index'
// Components
// import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import popupMessenger from '~/lib.next/messenger/popup'
import base58 from 'bs58'
// import '@lit-web3/dui/src/link'
@customElement('view-notification')
export class ViewStart extends TailwindElement(null) {
  // @state() message = ''
  @property() ROUTE?: any
  constructor() {
    super()
  }
  get message() {
    return new TextDecoder().decode(base58.decode(this.ROUTE.msg))
  }
  onReject() {
    popupMessenger.send('reply_personal_sign', false)
  }
  onSign() {
    popupMessenger.send('reply_personal_sign', true)
  }

  render() {
    return html`<div class="view-notification">
      <div class="text-center px-8">
        <div class="border rounded-full p-2 inline-block">www.opensea.io</div>
        <div class="text-xl font-bold mt-2">Signature request</div>
        <div class="mt-2">
          Only sign this message if you fully understand the content and trust the requesting site.
        </div>
        <div class="mt-3">You are signing:</div>
      </div>
      <div class="mt-2 border-t pt-4 px-4 pb-8">
        <div class="font-bold">Message:</div>
        <pre class="mt-2">${this.message}</pre>
      </div>
      <div class="grid grid-cols-2 gap-3 px-4 fixed bottom-0 w-full pb-4 pt-2 bg-white">
        <dui-button class="block w-full secondary outlined !rounded-full h-12" @click=${this.onReject} block
          >Reject</dui-button
        >
        <dui-button class="block w-full secondary !rounded-full h-12" @click=${this.onSign} block>Sign</dui-button>
      </div>
    </div>`
  }
}
