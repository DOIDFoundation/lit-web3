import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { keyringStore, StateController } from '~/store/keyring'
import { HardwareKeyringTypes } from '@/lib/keyringController'
import { getAddress, AddressType } from '@/lib/phrase'
import swGlobal from '~/ext.scripts/sw/swGlobal'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@/components/pwd_equal'

import style from './import4th.css?inline'
@customElement('import-4th')
export class ViewImport extends TailwindElement(style) {
  bindStore: any = new StateController(this, keyringStore)
  @property() placeholder = 'e.g. satoshi.doid'
  @state() secretRecoveryPhrase = ''
  @state() err = ''
  @state() pwd = ''
  @state() pending = false

  onPwdChange = (e: CustomEvent) => {
    const { pwd, error } = e.detail
    this.pwd = pwd
  }

  routeGoto = (path: string) => {
    goto(`${path}`)
  }

  onCreateMainAddress = async () => {
    try {
      // console.log(keyringStore.mnemonic, this.pwd, '----------')
      let ethAddress = await getAddress(keyringStore.mnemonic, AddressType.eth)
      console.log('mainAddress:', ethAddress, '------------')
      const encodedSeedPhrase = Array.from(Buffer.from(keyringStore.mnemonic, 'utf8').values())
      await swGlobal.controller.createNewVaultAndRestore(this.pwd, encodedSeedPhrase)
      goto('/main')
    } catch (err: any) {
      console.error(err)
    }
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
            this.onCreateMainAddress()} class="secondary !rounded-full h-12 w-12"><i class="mdi mdi-arrow-right"></dui-button>
        </div>

          </div>

          

        </div>
      </div>
    </div>`
  }
}
