import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { keyringController } from '@/lib/keyringController'
import { keyringStore, StateController } from '~/store/keyring'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@/components/phrase'

import style from './home.css?inline'
@customElement('view-import')
export class ViewImport extends TailwindElement(style) {
  bindStore: any = new StateController(this, keyringStore)
  @property() placeholder = 'e.g. satoshi.doid'
  @state() pwd = ''
  @state() err = ''
  @state() pending = false

  @state() phrase = ''
  @state() invalid: Record<string, string> = { pwd: '', phrase: '' }

  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    this.err = msg
    if (error) return
    this.pwd = val
  }

  routeGoto = (path: string) => {
    goto(`${path}`)
  }

  onPhraseChange = (e: CustomEvent) => {
    e.stopPropagation()
    const { phrase, error } = e.detail as any
    this.invalid = { ...this.invalid, phrase: error ?? '' }
    this.phrase = phrase
  }

  submit() {}
  render() {
    return html`<div class="home">
  <div class="dui-container sparse">
    <div class="dui-container sparse">
      <doid-symbol class="block mt-12">
        <span slot="h1" class="text-xl">You are setting 0xf446563d6737DF28D0FDe28C82CE4F34E98540f3</span>
        <p slot="msg">as main addresses for EVM chains for satoshi.doid</p>
      </doid-symbol>

      <div class="max-w-xs mx-auto">
        <span slot="label">
          <slot name="label">Enter your Secret Recovery Phrase</slot>
        </span>
        <textarea class="resize border rounded-md"></textarea>

        <div class="mt-4 flex justify-between">
          <dui-button @click=${() =>
            this.routeGoto('create-password')} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
            ><i class="mdi mdi-arrow-left text-gray-500"></i></dui-button>
          <dui-button @click=${() =>
            this.routeGoto(
              'recovery-phrase'
            )} class="secondary !rounded-full h-12 w-12"><i class="mdi mdi-arrow-right"></dui-button>
        </div>
      </div>
    </div>
  </div>
</div>`
  }
}
