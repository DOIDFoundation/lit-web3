import { TailwindElement, html, customElement, property, state, choose } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { keyringStore, StateController } from '~/store/keyring'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '~/components/phrase'
import '~/components/pwd_equal'

import style from './create.css?inline'
import { AddressType, getAddress } from '~/lib.legacy/phrase'
@customElement('view-create')
export class ViewHome extends TailwindElement(style) {
  bindStore: any = new StateController(this, keyringStore)
  @property() doid = ''
  @state() pending = false
  @state() btnNextDisabled = true
  @state() mnemonic = ''
  @state() pwd = ''
  @state() address = ''
  @state() step = 1

  onPhraseChange = async (e: CustomEvent) => {
    e.stopPropagation()
    this.btnNextDisabled = true
    const { phrase, error } = e.detail as any
    if (error) return

    this.mnemonic = phrase
    this.btnNextDisabled = false
  }

  onCreateMainAddress = async () => {
    let address = await getAddress(this.mnemonic, AddressType.eth)
    if (!address || typeof address != 'string' || !this.doid) return
    this.address = address
    try {
      this.pending = true
      this.next()
    } catch (e) {
    } finally {
      this.pending = false
    }
  }

  onPwdChange = (e: CustomEvent) => {
    const { pwd, error } = e.detail
    this.pwd = pwd
    this.btnNextDisabled = error
  }

  next() {
    this.step++
    this.btnNextDisabled = true
  }

  back() {
    if (this.step == 1) history.back()
    else this.step--
  }

  stepTo(step: number) {
    this.step = step
    this.btnNextDisabled = true
  }

  render() {
    return html`<div class="create">
      <div class="dui-container sparse">
        ${choose(
          this.step,
          [
            [
              1,
              () => html`<doid-symbol class="block mt-12">
                  <span slot="h1" class="text-xl">Your decentralized openid</span>
                  <p slot="msg">Safer, faster and easier entrance to chains, contacts and dApps</p>
                </doid-symbol>
                <div class="max-w-xs mx-auto">
                  <span slot="label"><slot name="label">${this.doid}</slot></span>
                  <span slot="msg" class="ml-1"><slot name="msg">is available</slot></span>
                </div>
                <div class="max-w-xs mx-auto my-2">
                  <dui-button class="outlined w-full my-2" block href="https://app.doid.tech/search/${this.doid}"
                    >Create with an Ethereum wallet</dui-button
                  >
                </div>
                <div class="max-w-xs mx-auto my-2">
                  <dui-button class="outlined w-full my-2" @click=${this.next} block
                    >Create in DOID for chrome</dui-button
                  >
                </div>`
            ],
            [
              2,
              () => html`<doid-symbol class="block mt-12"> </doid-symbol>
                <div class="my-4 text-xs">
                  You are trying to create
                  <dui-link class="link ml-1 underline">${this.doid}</dui-link>
                </div>
                <div class="my-4 text-xs">Enter your Secret Recovery Phrase</div>
                <phrase-to-secret class="my-4" @change=${this.onPhraseChange}></phrase-to-secret>
                <div class="my-4 text-xs">
                  This Secret Recovery Phrase will be used to create your DOID name and generate Main Addresses.
                </div>
                <div class="my-2 text-center">or</div>
                <dui-button text class="w-full my-2" @click=${() => goto(`/import3rd`)}
                  >Generate a Secret Recovery Phrase</dui-button
                >
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
            ],
            [
              3,
              () => html`<doid-symbol class="block mt-12">
                  <span slot="h1" class="text-base">Create password</span>
                </doid-symbol>
                <div class="my-4 text-xs">
                  This password will unlock your DOID name(s) only on this device. DOID can not recover this password.
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
            ],
            [
              4,
              () => html`<doid-symbol class="block mt-12"> </doid-symbol>
                <div class="my-4 text-xs">
                  You are trying to create
                  <dui-link class="link ml-1 underline">${this.doid}</dui-link>
                </div>
                <div class="my-4 text-xs">With ETH account${this.address}</div>
                <div class="my-4 text-xs">
                  A small amount of ETH is needed to pay gas. You can transfer some ETH to this account above and start
                  creation.
                </div>
                <div class="my-2 text-center">or</div>
                <dui-button text class="w-full my-2" @click=${() => this.stepTo(2)}
                  >Use other Secret Recovery Phrase</dui-button
                >`
            ]
          ],
          () =>
            html` <doid-symbol class="block mt-12">
              <span slot="h1" class="text-base">DOID recovery successful</span>
            </doid-symbol>`
        )}
      </div>
    </div>`
  }
}
