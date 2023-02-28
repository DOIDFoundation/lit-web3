import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
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
  @state() secretRecoveryPhrase = ''
  @state() err = ''
  @state() pending = false
  @state()
  @property()
  ownerAddress = '0xf446563d6737DF28D0FDe28C82CE4F34E98540f3'

  @property() title = 'Enter your Secret Recovery Phrase for 0xf446563d6737DF28D0FDe28C82CE4F34E98540f3'
  @state() invalid: Record<string, string> = { pwd: '', phrase: '' }
  @state() phrase = ''

  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    this.err = msg
    if (error) return
    this.secretRecoveryPhrase = val
  }

  onPhraseChange = (e: CustomEvent) => {
    e.stopPropagation()
    const { phrase, error } = e.detail as any
    this.invalid = { ...this.invalid, phrase: error ?? '' }
    this.phrase = phrase
  }

  routeGoto = (path: string) => {
    goto(`${path}`)
  }

  submit() {
    console.log(this.secretRecoveryPhrase)
  }
  render() {
    return html`<div class="home">
      <div class="dui-container sparse">
        <div class="dui-container sparse">
          <doid-symbol class="block mt-12">
            <span slot="h1" class="text-xl">You are importing an address as Main Address for satoshi.doid</p>
          </doid-symbol>
            <span slot="label">
              <slot name="label">Enter your Secret Recovery Phrase</slot>
           </span>
           <phrase-to-secret class="my-4" @change=${this.onPhraseChange}
          ><div slot="tip" class="mb-2 p-2 bg-blue-100 border border-blue-300 rounded text-xs">
            You can paste your entire secret recovery phrase into any field
          </div></phrase-to-secret>
          <span slot="h1" class="text-xs">This Secret Recovery Phrase will be used to generate main addresses for satoshi.doid on all chains</span>


          <div class="mt-4 flex justify-between">
          <dui-button @click=${() =>
            this.routeGoto('create-password')} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
            ><i class="mdi mdi-arrow-left text-gray-500"></i></dui-button>
          <dui-button @click=${() =>
            this.routeGoto(
              '/import4th'
            )} class="secondary !rounded-full h-12 w-12"><i class="mdi mdi-arrow-right"></dui-button>
        </div>

          </div>
        </div>

        

      </div>
    </div>`
  }
}
