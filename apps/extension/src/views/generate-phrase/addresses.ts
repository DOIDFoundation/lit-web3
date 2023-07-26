import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  repeat,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import { accountStore } from '~/store/account'
import { walletStore, StateController } from '~/store'
import { genMnemonic } from '~/lib.next/keyring/phrase'
import clipboard from '@lit-web3/dui/src/copy/clipboard'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'

import style from './phrase.css?inline'
@customElement('view-create-addresses')
export class ViewAddress extends TailwindElement(style) {
  bindStore: any = new StateController(this, walletStore)
  @property() pwd = ''
  @property() placeholder = 'Password'
  @state() phrase = ''
  @state() err = ''
  @state() pending = false
  @state() showPhrase = false

  get account() {
    return accountStore.account
  }
  get phraseArr() {
    return this.phrase.split(' ')
  }
  get phraseEnabled() {
    return this.pwd && this.phrase
  }
  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    this.err = msg
    if (error) return
    this.pwd = val
  }
  routeGoto = async (step: string) => {
    this.emit('routeGoto', { step, pwd: this.pwd, phrase: this.phrase })
  }
  onTogglePhrase = () => {
    if (!this.phraseEnabled) return
    this.showPhrase = !this.showPhrase
  }
  generatePhrase = async () => {
    if (!this.pwd) return
    this.phrase = genMnemonic()?.phrase
  }
  copyPhrase = async () => {
    if (!this.phraseEnabled) return
    try {
      await clipboard.writeText(this.phrase)
    } catch {}
  }
  submit() {}
  async connectedCallback() {
    super.connectedCallback()
    // generate phrase
    this.generatePhrase()
  }
  render() {
    return html` <div class="dui-container">
      <div class="text-lg font-bold mt-2 text-center">Create Addresses</div>
      <div class="mt-2 text-yellow-600">
        Warning: Don't send your recovery phrase to others, Anyone gets your recovery phrase, he can send your assets
        without notifying you.
      </div>
      <div class="mt-2">
        Your main addresses are generated with this 12-word Secret Recovery Phrase. Write down this 12-word Secret
        Recovery Phrase and save it in a place that you trust and only you can access.
      </div>
      <div class="my-4">
        <div class="mb-2">Tips:</div>
        <ul class="list-disc text-sm space-2">
          <li>Save in a password manager</li>
          <li>Store in a safe deposit box</li>
          <li>Write down and store in multiple secret places</li>
        </ul>
      </div>
      <div
        class="mt-2 relative rounded-md border-2 border-gray-600 flex items-center ${classMap({
          'h-28': !this.showPhrase
        })}"
      >
        ${when(
          this.showPhrase && this.phrase.length,
          () =>
            html`<div class="px-2 py-4 flex flex-wrap items-start gap-1">
              ${repeat(
                this.phraseArr,
                (phrase: string) =>
                  html`<div class="px-1.5 py-1 text-sm border border-gray-300 text-blue-600 rounded">${phrase}</div>`
              )}
            </div>`,
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
      </div>
      ${when(
        this.phraseEnabled,
        () => html`
          <div class="flex p-2 justify-between">
            <dui-button text class="!text-blue-400 !text-xs" @click=${this.onTogglePhrase}
              >${this.showPhrase ? 'Hide seed phrase' : 'Reveal seed phrase'}</dui-button
            >
            <dui-button @click=${this.copyPhrase} text class="!text-blue-400 !text-xs">Copy to clipboard</dui-button>
          </div>
        `
      )}
      <!-- actions -->
      <div class="mt-4 flex justify-between">
        <dui-button @click=${() => this.routeGoto('1')} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
          ><i class="mdi mdi-arrow-left text-gray-500"></i
        ></dui-button>
        <dui-button
          .disabled=${!this.phraseEnabled}
          @click=${() => this.routeGoto('3')}
          class="secondary !rounded-full h-12 w-12"
          ><i class="mdi mdi-arrow-right"></i
        ></dui-button>
      </div>
    </div>`
  }
}
