import { TailwindElement, html, customElement, property, state, when } from '@lit-web3/dui/src/shared/TailwindElement'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'

import style from './phrase.css?inline'
import { goto } from '@lit-web3/dui/src/shared/router'
import { StateController, walletStore } from '~/store'
import { accountStore } from '~/store/account'
import popupMessenger from '~/lib.next/messenger/popup'

@customElement('view-recovery')
export class ViewAddress extends TailwindElement(style) {
  state = new StateController(this, walletStore)
  bindAccount: any = new StateController(this, accountStore)
  @property() phrase = ''
  @property() pwd = ''
  @property() placeholder = 'Password'
  @state() phraseElements: string[] = []
  @state() validate = false
  @state() randomPhrase: { name: String; active: Boolean }[] = []

  get account() {
    return accountStore.account
  }
  get phraseArr() {
    return this.phrase.split(' ')
  }

  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    // this.err = msg
    if (error) return
    // this.pwd = val
  }
  routeGoto = (step: string) => {
    goto(`/generate-phrase/${step}`)
  }
  // gas punch sport hen claim click scene employ zoo catch luxury east
  confuse = () => {
    if (!this.phraseArr.length) return
    const _randomPhrase = [...this.phraseArr].sort(() => (Math.random() > 0.5 ? -1 : 1))
    _randomPhrase.forEach((item: string) => {
      this.randomPhrase.push({ name: item, active: false })
    })
  }
  onRecovery = (item: any) => {
    if (!item.active) {
      this.phraseElements.push(item.name)
    } else {
      const idx = this.phraseElements.indexOf(item.name)
      this.phraseElements.splice(idx, 1)
    }
    this.validate = this.phrase === this.phraseElements.join(' ')
    item.active = !item.active
    this.phraseElements = this.phraseElements.splice(0)
    // this.requestUpdate('phraseElements')
  }
  get phraseString() {
    return this.phraseElements.join(' ')
  }
  submit = async () => {
    try {
      await popupMessenger.send('internal_create_vault', {
        doid: this.account.name,
        pwd: this.pwd,
        mnemonic: this.phrase
      })
    } catch (e) {
      console.error(e)
    }
    // await walletStore.createNewVaultAndKeychain(this.pwd)
    // await walletStore.setSeedPhraseBackedUp(true)
    // await walletStore.setCompletedOnboarding()
    // goto('/main')

    // const res = await swGlobal.Controller.keyringController.memStore.getState()
    // const storeData = await chrome.storage.local.get()
    // const data = Object.assign(storeData.data, {
    //   onboardingController: {
    //     completedOnboarding: true
    //   }
    // })
    // await chrome.storage.local.set({ data })
    // console.log(await chrome.storage.local.get(), 'chrome')
  }

  connectedCallback() {
    super.connectedCallback()
    this.confuse()
  }

  render() {
    return html` <div class="dui-container">
      <div class="text-lg font-bold mt-2 text-center">Confirm Secret Recovery Phrase</div>
      <div class="mt-2 ">
        <textarea class="border rounded-md w-full h-24 p-2" .value=${this.phraseString} readonly></textarea>
      </div>
      ${when(
        this.phrase,
        () => html`
          <div class="mt-2 text-center flex flex-wrap">
            ${this.randomPhrase.map(
              (item) =>
                html`<div
                  class="p-2 my-2 cursor-pointer mr-2 ${item.active ? 'bg-blue-600 text-white' : 'bg-gray-300'}"
                  @click=${() => this.onRecovery(item)}
                >
                  ${item.name}
                </div>`
            )}
          </div>
        `
      )}
      <!-- <div>${this.phraseElements}----</div> -->
      <div class="mt-4 flex justify-between">
        <dui-button @click=${() => this.routeGoto('2')} class="!rounded-full h-12 outlined w-12 !border-gray-500 "
          ><i class="mdi mdi-arrow-left text-gray-500"></i
        ></dui-button>
        <dui-button
          .disabled="${!this.validate}"
          @click=${() => this.submit()}
          class="secondary !rounded-full h-12 w-12"
          ><i class="mdi mdi-arrow-right"></i
        ></dui-button>
      </div>
    </div>`
  }
}
