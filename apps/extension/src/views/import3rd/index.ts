import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { keyringStore, StateController } from '~/store/keyring'
import { doidController } from '@/lib/keyringController'
import { HardwareKeyringTypes } from '@/lib/keyringController'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@/components/phrase'

import style from './import3rd.css?inline'
@customElement('import-3rd')
export class ViewImport extends TailwindElement(style) {
  bindStore: any = new StateController(this, keyringStore)
  @property() placeholder = 'e.g. satoshi.doid'
  @property() doidName = 'satoshi.doid'
  @state() secretRecoveryPhrase = ''
  @state() err = ''
  @state() pending = false
  @state() mnemonic = ''

  onPhraseChange = (e: CustomEvent) => {
    e.stopPropagation()
    const { phrase } = e.detail as any
    // console.log(phrase)
    // const encodedSeedPhrase = Array.from(Buffer.from(phrase, 'utf8').values())
    // this.getFirstAccountFromSeedPhrase(encodedSeedPhrase)
    keyringStore.mnemonic = phrase
  }

  routeGoto = (path: string) => {
    goto(`${path}`)
  }

  // async getFirstAccountFromSeedPhrase(seedPhrase: number[]) {
  //   const keyring = await doidController.keyringController._newKeyring(HardwareKeyringTypes.hdKeyTree, {
  //     mnemonic: seedPhrase,
  //     numberOfAccounts: 1
  //   })

  //   const [firstAccount] = await keyring.getAccounts()
  //   console.log(firstAccount)
  //   if (!firstAccount) {
  //     throw new Error('KeyringController - First Account not found.')
  //   }
  //   return firstAccount
  // }
  render() {
    return html`<div class="home">
      <div class="dui-container sparse">
        <div class="dui-container sparse">
          <doid-symbol class="block mt-12">
            <span slot="h1" class="text-xl">You are importing an address as Main Address for ${this.doidName}</span>
          </doid-symbol>
            <span slot="label">
              <slot name="label">Enter your Secret Recovery Phrase</slot>
           </span>
           <phrase-to-secret class="my-4" @change=${this.onPhraseChange}
          ><div slot="tip" class="mb-2 p-2 bg-blue-100 border border-blue-300 rounded text-xs">
            You can paste your entire secret recovery phrase into any field
          </div></phrase-to-secret>
          <span slot="h1" class="text-xs">This Secret Recovery Phrase will be used to generate main addresses for ${
            this.doidName
          } on all chains</span>


          <div class="mt-4 flex justify-between">
          <dui-button @click=${() => this.routeGoto('/main')} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
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
