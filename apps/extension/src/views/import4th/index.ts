import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { keyringStore, StateController } from '~/store/keyring'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@/components/pwd_equal'

import style from './home.css?inline'
@customElement('view-import')
export class ViewImport extends TailwindElement(style) {
  bindStore: any = new StateController(this, keyringStore)
  @property() placeholder = 'e.g. satoshi.doid'
  @state() secretRecoveryPhrase = ''
  @state() err = ''
  @state() pwd = ''
  @state() pending = false
  @property() ownerAddress = '0xf446563d6737DF28D0FDe28C82CE4F34E98540f3'

  @property() title = 'Enter your Secret Recovery Phrase for 0xf446563d6737DF28D0FDe28C82CE4F34E98540f3'
  @state() phrase = ''
  @state() invalid: Record<string, string> = { pwd: '', phrase: '' }

  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    this.err = msg
    if (error) return
    this.secretRecoveryPhrase = val
  }

  onPwdChange = (e: CustomEvent) => {
    const { pwd, error } = e.detail
    this.pwd = pwd
    this.invalid = { ...this.invalid, pwd: error ?? '' }
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
            <span slot="h1" class="text-base">Create password</span>
          </doid-symbol>
          <div class="max-w-xs mx-auto">
            <span slot="h1" class="text-sm"
              >This password will unlock your DOID name(s) only on this device. DOID can not recover this
              password.</span
            >

            <pwd-equal class="mt-8" @change=${this.onPwdChange}></pwd-equal>

            <div class="mt-4 flex justify-between">
          <dui-button @click=${() =>
            this.routeGoto('/import3rd')} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
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
