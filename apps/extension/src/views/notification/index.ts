import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
// import { goto } from '@lit-web3/dui/src/shared/router/index'
import { isHexPrefixed } from 'ethereumjs-util'
// Components
// import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import popupMessenger from '~/lib.next/messenger/popup'
// import '@lit-web3/dui/src/link'
@customElement('view-notification')
export class ViewStart extends TailwindElement(null) {
  @state() message = ''
  constructor() {
    super()
    popupMessenger.on('popup_personal_sign', ({ data }: { data: any }) => {
      this.message = this.msgHexToText(data)
      console.log(data, 'data', this.message)
    })
  }
  onReject() {
    popupMessenger.send('reply_personal_sign', false)
  }
  onSign() {
    popupMessenger.send('reply_personal_sign', true)
  }
  stripHexPrefix(str: string) {
    if (typeof str !== 'string') {
      return str
    }
    return isHexPrefixed(str) ? str.slice(2) : str
  }
  msgHexToText = (hex: string) => {
    try {
      const stripped = this.stripHexPrefix(hex)
      const buff = Buffer.from(stripped, 'hex')
      return buff.length === 32 ? hex : buff.toString('utf8')
    } catch (e) {
      return hex
    }
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
        <div class="mt-2">${this.message}</div>
      </div>
      <div class="grid grid-cols-2 gap-3 px-4 fixed bottom-0 w-full pb-4">
        <dui-button class="block w-full secondary outlined !rounded-full h-12" @click=${this.onReject} block
          >Reject</dui-button
        >
        <dui-button class="block w-full secondary !rounded-full h-12" @click=${this.onSign} block>Sign</dui-button>
      </div>
    </div>`
  }
}
