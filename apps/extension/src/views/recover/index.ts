import {
  TailwindElement,
  html,
  customElement,
  when,
  property,
  state,
  choose
} from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { getAddress, AddressType } from '@/lib/phrase'
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english'
import { keyringStore, StateController } from '~/store/keyring'
import { accountStore } from '~/store/account'
import { validateMnemonic } from 'ethereum-cryptography/bip39'
import { initialize } from '@/lib/keyringController'
import swGlobal from '~/ext.scripts/sw/swGlobal'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@/components/phrase'
import '@/components/pwd_equal'

import style from './recover.css?inline'
@customElement('view-recover')
export class ViewImport extends TailwindElement(style) {
  bindStore: any = new StateController(this, keyringStore)
  bindAccount: any = new StateController(this, accountStore)
  @property() step?: any
  @property() doidName = ''
  @state() secretRecoveryPhrase = ''
  @state() err = ''
  @state() pending = false
  @state() mnemonic = ''
  @state() pwd = ''

  @state() start = '1'

  @state() mainAddress = ''

  get account() {
    return accountStore.account
  }

  // get currentStep() {
  //   return this.step ?? 1
  // }

  // next = () => {
  //   goto(`/recover/${this.currentStep + 1}`)
  // }

  onPwdChange = (e: CustomEvent) => {
    const { pwd, error } = e.detail
    this.pwd = pwd
  }

  async showAddress() {
    const [firstAccount] = await swGlobal.controller.keyringController.getAccounts()
    console.log(firstAccount, '------------')
    if (!firstAccount) {
      throw new Error('KeyringController - First Account not found.')
    }
    return firstAccount
  }

  onCreateMainAddress = async () => {
    try {
      await initialize()
      console.log(this.mnemonic, this.pwd, '----------')
      const encodedSeedPhrase = Array.from(Buffer.from(this.mnemonic, 'utf8').values())

      await swGlobal.controller.keyringController.createNewVaultAndRestore(this.pwd, encodedSeedPhrase)
      this.showAddress()
      this.start = '4'
    } catch (err: any) {
      console.error(err)
    }
  }

  onPhraseChange = async (e: CustomEvent) => {
    e.stopPropagation()
    const { phrase } = e.detail as any
    this.mnemonic = phrase
    console.log(this.mnemonic)

    let error = validateMnemonic(this.mnemonic, wordlist)
    this.err = error ? '' : 'Bad mnemonic'
    console.log(error)
    if (!error) return

    let ethAddress = await getAddress(this.mnemonic, AddressType.eth)
    console.log(ethAddress, '---------')

    if (this.account.mainAddress != ethAddress) {
      this.start = '2'
    }
  }

  routeGoto = (path: string) => {
    goto(`${path}`)
  }

  render() {
    return html`<div class="home">
      <div class="dui-container sparse">
        <div class="dui-container sparse">
          ${when(
            this.start == '1',
            () => html`
            <doid-symbol class="block mt-12">
            <span slot="h1" class="text-xl">
              <p>You are recovering</p>
              <p>${this.account.name}</p>
            </span>
          </doid-symbol>
              <span slot="label">
              <slot name="label">Enter the Secret Recovery Phrase of ${this.mainAddress}</slot>
           </span>
           <phrase-to-secret class="my-4" @change=${this.onPhraseChange}></phrase-to-secret>
           <div class="mt-4 flex justify-between">
          <dui-button @click=${() =>
            this.routeGoto('/login')} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
            ><i class="mdi mdi-arrow-left text-gray-500"></i></dui-button>
          <dui-button @click=${() =>
            (this.start = '3')} class="secondary !rounded-full h-12 w-12"><i class="mdi mdi-arrow-right"></dui-button>
        </div>
            `
          )}
          ${when(
            this.start == '2',
            () => html`
              <doid-symbol class="block mt-12">
                <span slot="h1" class="text-xl">
                  <p>You are recovering</p>
                  <p>${this.account.name}</p>
                </span>
              </doid-symbol>
              <span slot="label">
                <slot name="label">The Secret Recovery Phrase entered does not match ${this.mainAddress}</slot>
              </span>
            `
          )}
          ${when(
            this.start == '3',
            () => html`
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
          <dui-button @click=${() => (this.start = '1')} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
            ><i class="mdi mdi-arrow-left text-gray-500"></i></dui-button>
          <dui-button @click=${() =>
            this.onCreateMainAddress()} class="secondary !rounded-full h-12 w-12"><i class="mdi mdi-arrow-right"></dui-button>
          `
          )}
          ${when(
            this.start == '4',
            () => html`
              <doid-symbol class="block mt-12">
                <span slot="h1" class="text-base"> DOID recovery successful </span>
              </doid-symbol>
              <div class="text-center text-sm">You’ve successfully recovered your DOID name.</div>
              <div class="text-sm text-center">
                Keep your Secret Recovery Phrase safe and secret -- it’s your responsibility!
              </div>
              <div class="text-sm text-center">Remeber:</div>
              <div class="text-sm text-center">
                <ul>
                  <li>DOID can’t recover your Secret Recovery Phrase.</li>
                  <li>DOID will never ask you for your Secret Recovery Phrase.</li>
                  <li>Never share your Secret Recovery Phrase with anyone or risk your funds being stolen</li>
                </ul>
              </div>
              <div class="mt-2 text-center">
                <dui-button @click=${() => this.routeGoto('/start')} class="secondary h-30 w-30">GOT IT</dui-button>
              </div>
            `
          )}
        </div>
      </div>
    </div>`
  }
}
