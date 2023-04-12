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
import {
  customElement,
  html,
  property,
  state,
  TailwindElement,
  choose,
  when
} from '@lit-web3/dui/src/shared/TailwindElement'
import popupMessenger from '~/lib.next/messenger/popup'

@customElement('view-recover')
export class ViewImport extends TailwindElement(null) {
  state = new StateController(this, walletStore)
  bindStore: any = new StateController(this, keyringStore)
  bindAccount: any = new StateController(this, accountStore)
  @property() doidName = ''
  @state() secretRecoveryPhrase = ''
  @state() err = ''
  @state() btnNextDisabled = true
  @state() pending = false
  @state() mnemonic = ''
  @state() pwd = ''

  @state() step = 1

  constructor() {
    super()
    if (!this.account.name) goto('/')
  }

  get account() {
    return accountStore.account
  }

  onPwdChange = (e: CustomEvent) => {
    const { pwd, error } = e.detail
    this.pwd = pwd
    this.btnNextDisabled = error
  }

  onCreateMainAddress = async () => {
    let addresses = await getAddress(this.mnemonic)
    if (!addresses || !this.account.name) return
    try {
      this.pending = true
      const res = await popupMessenger.send('internal_recovery', {
        doid: this.account.name,
        json: { addresses },
        pwd: this.pwd,
        mnemonic: this.mnemonic
      })
      console.info('res:', res)
      this.next()
    } catch (e) {
      popupMessenger.log(e)
    } finally {
      this.pending = false
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
    this.btnNextDisabled = true
    const { phrase, error } = e.detail as any
    if (error) return

    this.mnemonic = phrase

    let ethAddress = await getAddress(this.mnemonic, AddressType.eth)

    if (this.account.mainAddress != ethAddress) {
      this.err = `The Secret Recovery Phrase entered does not match ${this.account.mainAddress}`
      return
    }
    this.btnNextDisabled = false
  }

  back() {
    if (this.step == 1) history.back()
    else this.step--
  }

  next() {
    this.step++
    this.btnNextDisabled = true
  }

  connectedCallback() {
    super.connectedCallback()
  }

  render() {
    return html`<div class="home">
      <div class="dui-container sparse">
        ${choose(
          this.step,
          [
            [
              1,
              () => html` <doid-symbol sm class="block mt-12"></doid-symbol>
                <div class="my-4 text-xs">
                  You are recovering
                  <dui-link class="link ml-1 underline">${this.account.name}</dui-link>
                </div>
                <div class="my-4 text-xs">
                  Enter the Secret Recovery Phrase of
                  <dui-address class="mx-1" .address=${this.account.mainAddress}></dui-address>
                </div>
                <phrase-to-secret class="my-4" @change=${this.onPhraseChange}></phrase-to-secret>
                <div class="w-full text-red-500">${this.err}</div>
                <div class="mt-4 flex justify-between">
                  <dui-button @click=${this.back} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
                    ><i class="mdi mdi-arrow-left text-gray-500"></i
                  ></dui-button>
                  <dui-button
                    ?disabled=${this.btnNextDisabled}
                    @click=${this.next}
                    class="secondary !rounded-full h-12 w-12"
                    ><i class="mdi mdi-arrow-right"></i
                  ></dui-button>
                </div>`
            ],
            [
              2,
              () =>
                when(
                  this.pending,
                  () => html`<doid-symbol sm class="block mt-12">
                      <span slot="h1" class="text-base">Recovering ${this.account.name}</span>
                    </doid-symbol>
                    <div class="flex justify-center"><i class="text-2xl mdi mdi-loading"></i></div>`,
                  () => html`<doid-symbol sm class="block mt-12">
                      <span slot="h1" class="text-base">Create password</span>
                    </doid-symbol>
                    <div class="my-4 text-xs">
                      This password will unlock your DOID name(s) only on this device. DOID can not recover this
                      password.
                    </div>
                    <pwd-equal class="mt-8" @change=${this.onPwdChange}></pwd-equal>
                    <div class="mt-4 flex justify-between">
                      <dui-button @click=${this.back} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
                        ><i class="mdi mdi-arrow-left text-gray-500"></i
                      ></dui-button>
                      <dui-button
                        ?disabled=${this.btnNextDisabled}
                        @click=${this.onCreateMainAddress}
                        class="secondary !rounded-full h-12 w-12"
                        ><i class="mdi mdi-arrow-right"></i
                      ></dui-button>
                    </div> `
                )
            ]
          ],
          () =>
            html` <doid-symbol sm class="block mt-12">
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
                <dui-button @click=${() => goto('/main')} class="secondary h-30 w-30">GOT IT</dui-button>
              </div>`
        )}
      </div>
    </div>`
  }
}
