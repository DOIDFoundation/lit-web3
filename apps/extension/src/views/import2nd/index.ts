import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { keyringStore, StateController } from '~/store/keyring'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '~/components/phrase'

import style from './import2nd.css?inline'
@customElement('import-2nd')
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

  onPhraseChange = (e: CustomEvent) => {
    e.stopPropagation()
    const { phrase } = e.detail as any
    console.log(phrase)
    keyringStore.mnemonic = phrase
  }

  routeGoto = (path: string) => {
    goto(`${path}`)
  }

  submit() {}
  render() {
    return html`<div class="home">
  <div class="dui-container sparse">
    <div class="dui-container sparse">
      <doid-symbol class="block mt-12">
      <div slot="h1"><div class="text-lg">You are setting</div><span class="text-sm">0xf446563d6737DF28D0FDe28C82CE4F34E98540f3</span></div>
        <p slot="msg">as main addresses for EVM chains for satoshi.doid</p>
      </doid-symbol>

      
        <span slot="label">
          <slot name="label">Enter your Secret Recovery Phrase</slot>
        </span>
        <phrase-to-secret class="my-4" @change=${this.onPhraseChange}
          ><div slot="tip" class="mb-2 p-2 bg-blue-100 border border-blue-300 rounded text-xs">
            You can paste your entire secret recovery phrase into any field
          </div></phrase-to-secret>

        <div class="mt-4 flex justify-between">
          <dui-button @click=${() => this.routeGoto('/main')} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
            ><i class="mdi mdi-arrow-left text-gray-500"></i></dui-button>
          <dui-button @click=${() =>
            this.routeGoto(
              '/main'
            )} class="secondary !rounded-full h-12 w-12"><i class="mdi mdi-arrow-right"></dui-button>
        </div>
      
    </div>
  </div>
</div>`
  }
}
