import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'

import style from './phrase.css?inline'
import { goto } from '@lit-web3/dui/src/shared/router'
@customElement('view-recovery')
export class ViewAddress extends TailwindElement(style) {
  @property() placeholder = 'Password'
  @state() pwd = ''
  @state() err = ''
  @state() pending = false

  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    this.err = msg
    if (error) return
    this.pwd = val
  }
  routeGoto = (path: string) => {
    goto(`/generate-phrase/${path}`)
  }
  submit() {}
  render() {
    return html`
      <div class="dui-container">
        <div class="text-lg font-bold mt-2 text-center">Confirm Secret Recovery Phrase</div>
        <div class="mt-2 ">
          <textarea class="resize border rounded-md w-full h-42"></textarea>
        </div>
        <div class="mt-2 text-center flex flex-wrap">
          <div class="p-2 bg-gray-100 my-2 cursor-pointer">attend</div>
          <div class="p-2 bg-gray-100 ml-2 my-2 cursor-pointer">Secret</div>
          <div class="p-2 bg-gray-100 ml-2 my-2 cursor-pointer">Recovery</div>
          <div class="p-2 bg-gray-100 ml-2 my-2 cursor-pointer">Write</div>
          <div class="p-2 bg-gray-100 ml-2 my-2 cursor-pointer">down</div>
          <div class="p-2 bg-gray-100 ml-2 my-2 cursor-pointer">store</div>
          <div class="p-2 bg-gray-100 ml-2 my-2 cursor-pointer">multiple</div>
          <div class="p-2 bg-gray-100 ml-2 my-2 cursor-pointer">attend</div>
          <div class="p-2 bg-gray-100 ml-2 my-2 cursor-pointer">Secret</div>
          <div class="p-2 bg-gray-100 ml-2 my-2 cursor-pointer">Recovery</div>
          <div class="p-2 bg-gray-100 ml-2 my-2 cursor-pointer">Write</div>
          <div class="p-2 bg-gray-100 ml-2 my-2 cursor-pointer">down</div>
        </div>
        
        <div class="mt-4 flex justify-between">
        <dui-button @click=${() =>
          this.routeGoto('generate-addresses')} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
            ><i class="mdi mdi-arrow-left text-gray-500"></i
          ></dui-button>
          <dui-button @click=${() =>
            this.routeGoto(
              'create-password'
            )} class="secondary !rounded-full h-12 w-12"><i class="mdi mdi-arrow-right"></dui-button>
        </div>
    </div>`
  }
}
