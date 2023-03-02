import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'

import style from './phrase.css?inline'
import { goto } from '@lit-web3/dui/src/shared/router'
import { doidController } from '@/lib/keyringController'
@customElement('view-create-addresses')
export class ViewAddress extends TailwindElement(style) {
  @property() phrase = ''
  @property() placeholder = 'Password'
  @state() pwd = ''
  @state() err = ''
  @state() pending = false
  @state() showPhrase = true

  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    this.err = msg
    if (error) return
    this.pwd = val
  }
  routeGoto = (path: string) => {
    // goto(`/generate-phrase/${path}`)
    this.emit('routeGoto', { path, pwd: this.pwd })
  }
  onTogglePhrase = () => {
    this.showPhrase = !this.showPhrase
  }
  submit() {}
  render() {
    return html`
      <div class="dui-container">
        <div class="text-lg font-bold mt-2 text-center">Create Addresses</div>
        <div class="mt-2 text-center text-yellow-600">
          Warning: Don't send your recovery phrase to others, Anyone gets your recovery phrase, he can send your assets without notifying you.
        </div>
        <div class="mt-2 text-center ">
          Your main addresses are generated with this 12-word Secret Recovery Phrase. Write down this 12-word Secret Recovery Phrase and save it in a place that you trust and only you can access.
        </div>
        <div class="mt-2">
          <div>Tips:</div>
          <ul class="list-disc">
            <li>Save in a password manager</li>
            <li>Store in a safe deposit box</li>
            <li>Write down and store in multiple secret places</li>
          </ul>
        </div>
        <div class="mt-2 relative rounded-md border-2 border-gray-600 h-24">
          ${when(
            this.showPhrase,
            () => html`
              <div
                @click=${this.onTogglePhrase}
                class="z-1 absolute cursor-pointer rounded-md flex flex-col justify-center items-center p-4 w-full h-full top-0 left-0 bg-gray-400"
              >
                <i class="mdi mdi-eye-outline text-white text-xl"></i>
                <div class="mt-2 text-center text-white text-xs">
                  <div class="text-center">CLICK HERE TO REVEAL SECRET WORDS</div>
                  <div class="mt-1">Make sure no one is watching your screen</div>
                </div>
              </div>
            `
          )}
          
          <textarea class="rounded-md w-full h-full p-4" readonly .value=${this.phrase}></textarea>
        </div>
        <div class="flex p-2 justify-between">
          <dui-button text class="!text-blue-400 !text-sm" @click=${this.onTogglePhrase}>${
      this.showPhrase ? 'Reveal seed phrase' : 'Hide seed phrase'
    }</dui-button>
          <dui-button text class="!text-blue-400 !text-sm">Copy to clipboard</dui-button>
        </div>
        <div class="mt-4 flex justify-between">
          <dui-button @click=${() =>
            this.routeGoto('create-password')} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
            ><i class="mdi mdi-arrow-left text-gray-500"></i
          ></dui-button>
          <dui-button @click=${() =>
            this.routeGoto(
              'recovery-phrase'
            )} class="secondary !rounded-full h-12 w-12"><i class="mdi mdi-arrow-right"></dui-button>
        </div>
    </div>`
  }
}
