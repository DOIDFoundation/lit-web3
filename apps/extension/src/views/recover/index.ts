// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '~/components/phrase'
import '~/components/pwd_equal'

import { validateMnemonic } from 'ethereum-cryptography/bip39'
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english'
import { AddressType, getAddress } from '~/lib.legacy/phrase'
import ipfsHelper from '~/lib.next/ipfsHelper'
// import swGlobal from '~/ext.scripts/sw/swGlobal'
import { StateController, walletStore } from '~/store'
import { accountStore } from '~/store/account'
import { keyringStore } from '~/store/keyring'

import { goto } from '@lit-web3/dui/src/shared/router'
import { customElement, html, property, state, TailwindElement, when } from '@lit-web3/dui/src/shared/TailwindElement'
import popupMessenger from '~/lib.next/messenger/popup'

import style from './recover.css?inline'

@customElement('view-recover')
export class ViewImport extends TailwindElement(style) {
  state = new StateController(this, walletStore)
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

  // @state() mainAddress = this.mainAddress

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

  onCreateMainAddress = async () => {
    let addresses = await getAddress(this.mnemonic)
    if (!addresses || !this.account.name) return
    try {
      const res = await popupMessenger.send('internal_recovery', {
        doid: this.account.name,
        json: { addresses },
        pwd: this.pwd,
        mnemonic: this.mnemonic
      })
      console.info('res:', res)
      this.start = '4'
    } catch (e) {
      popupMessenger.log(e)
    }
    //
    // try {
    //   await initialize()
    //   console.log(this.mnemonic, this.pwd, '----------')
    //   const encodedSeedPhrase = Array.from(Buffer.from(this.mnemonic, 'utf8').values())
    //   // TODO: open
    //   // await walletStore.createNewVaultAndRestore(this.account.name, this.pwd, encodedSeedPhrase)
    //   await this.syncAddresses()

    //   // TODO: open
    //   // this.start = '4'
    // } catch (err: any) {
    //   console.error(err)
    // }
  }

  syncAddresses = async () => {
    let addresses = await getAddress(this.mnemonic)
    if (!addresses || !this.account.name) return
    try {
      await ipfsHelper.updateJsonData({ addresses }, this.account.name, { memo: this.mnemonic })
    } catch (e) {
      console.error(e)
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

  connectedCallback() {
    super.connectedCallback()
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
              <slot name="label">Enter the Secret Recovery Phrase of ${this.account.mainAddress}</slot>
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
                <slot name="label">The Secret Recovery Phrase entered does not match ${this.account.mainAddress}</slot>
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
