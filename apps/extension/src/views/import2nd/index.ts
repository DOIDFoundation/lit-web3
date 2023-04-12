import {
  TailwindElement,
  html,
  customElement,
  when,
  property,
  state,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { accountStore } from '~/store/account'
import { keyringStore, StateController } from '~/store/keyring'
import { validateMnemonic } from 'ethereum-cryptography/bip39'
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english'
import { AddressType, getAddress } from '~/lib.legacy/phrase'
import popupMessenger from '~/lib.next/messenger/popup'
import ipfsHelper from '~/lib.next/ipfsHelper'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '~/components/phrase'
import '~/components/pwd_equal'

import style from './import2nd.css?inline'
import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
@customElement('import-2nd')
export class ViewImport extends TailwindElement(style) {
  bindStore: any = new StateController(this, keyringStore)
  @property() placeholder = 'e.g. satoshi.doid'
  @state() pwd = ''
  @state() err = ''
  @state() pending = false

  @state() step = 1
  @state() phrase = ''
  @state() invalid: Record<string, string> = { pwd: '', phrase: '' }

  get account() {
    return accountStore.account
  }

  get wrapName() {
    return wrapTLD(this.account.name)
  }

  get ownerAddr() {
    return this.account.owner ?? ''
  }

  onPhraseChange = async (e: CustomEvent) => {
    e.stopPropagation()
    const { phrase } = e.detail as any
    this.phrase = phrase

    // menonic validate
    let error = validateMnemonic(this.phrase, wordlist)
    this.err = error ? '' : 'Bad mnemonic'
    if (!error) return
    // check owner address match
    let ethAddr = await getAddress(this.phrase, AddressType.eth)
    if (this.ownerAddr.toLowerCase() != ethAddr) {
      this.err = 'Owner Address not match, please check'
    }
  }
  onPwdChange = (e: CustomEvent) => {
    const { pwd, error } = e.detail
    this.pwd = pwd
  }
  onRecoverByOwnerAddr = async () => {
    try {
      if (this.pending) return
      let addrs = await getAddress(this.phrase)
      if (!addrs || !this.account.name) return
      this.pending = true
      await popupMessenger.send('internal_recovery', {
        doid: this.account.name,
        json: { addrs },
        pwd: this.pwd,
        mnemonic: this.phrase,
        reply: true
      })
    } catch (e) {
      console.error(e)
    } finally {
      this.pending = false
    }
  }
  routeGoto = (path: string) => {
    goto(`${path}`)
  }
  goBack = () => {
    if (this.step > 1) this.step--
  }
  goNext = async (e: CustomEvent) => {
    e.preventDefault()
    if (this.step < 2) {
      this.step++
      return
    }
    try {
      await this.onRecoverByOwnerAddr()
      goto(`/unlock`)
    } catch {}
  }

  submit() {}

  render() {
    return html`
    <div class="home">
      <div class="dui-container sparse">
        ${when(
          this.step == 1,
          () => html`
            <doid-symbol class="block mt-12">
              <div slot="h1">
                <div class="text-lg">You are setting</div>
                <span class="text-sm">${this.ownerAddr}</span>
              </div>
              <p slot="msg">as main addresses for EVM chains for ${this.wrapName}</p>
            </doid-symbol>

            <span slot="label">
              <slot name="label">Enter your Secret Recovery Phrase</slot>
            </span>

            <phrase-to-secret class="my-4" @change=${this.onPhraseChange}>
              <div slot="tip" class="mb-2 p-2 bg-blue-100 border border-blue-300 rounded text-xs">
                You can paste your entire secret recovery phrase into any field
              </div>
            </phrase-to-secret>
          `
        )}
        ${when(
          this.step == 2,
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
            </div>
          `
        )}
        ${when(this.err, () => html`<div class="mt-4"><span class="text-red-500">${this.err}</span></div>`)}
        
        <div class="mt-4 flex justify-between">
          <div>
            ${when(
              this.step > 1,
              () => html`
                <dui-button
                  .disabled=${this.pending}
                  @click=${this.goBack}
                  class="!rounded-full h-12 outlined w-12 !border-gray-500"
                  ><i class="mdi mdi-arrow-left text-gray-500"></i
                ></dui-button>
              `
            )}
          </div>
          <dui-button .disabled=${this.pending || this.err} .pending=${this.pending} @click=
            ${this.goNext} class="secondary !rounded-full h-12 w-12"><i class="mdi ${classMap({
      'mdi-loading': this.pending,
      'mdi-arrow-right': !this.pending
    })}" ></dui-button>
        </div>
      </div>
    </div>`
  }
}
