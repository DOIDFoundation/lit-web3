import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router/index'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'
import './password'
import './addresses'
import './recovery'
import '../unlock'

import style from './phrase.css?inline'
import { StateController, walletStore } from '~/store'
// const localStore = new LocalStore()

@customElement('view-phrase')
export class ViewPhrase extends TailwindElement(style) {
  // state = new StateController(this, walletStore)
  constructor() {
    super()
    // goto(`/unlock${location.pathname}`)
    // console.log(location.pathname, 'location.pathname')
  }
  @property() ROUTE?: any
  @property() steps = [
    {
      id: 1,
      title: 'Create password',
      pathName: 'create-password'
    },
    {
      id: 2,
      title: 'Generate SecretRecovery Phrase',
      pathName: 'generate-addresses'
    },
    {
      id: 3,
      title: 'Confirm secret recovery phrase',
      pathName: 'recovery-phrase'
    }
  ]
  @property() placeholder = 'Password'
  @state() pwd = ''
  @state() err = ''
  @state() pending = false
  @property() phrase = ''

  get curStep() {
    return this.ROUTE?.step || 1
  }
  get activeRoute() {
    return this.steps.find((item) => item.id == this.curStep)
  }
  get activePathName() {
    return this.activeRoute?.pathName
  }

  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    this.err = msg
    if (error) return
    this.pwd = val
  }
  getStepPage() {
    if (this.activePathName === 'create-password') {
      return html`<view-create-pwd @routeGoto=${this.routeGoto}></view-create-pwd>`
    } else if (this.activePathName === 'generate-addresses') {
      return html`<view-create-addresses @routeGoto=${this.routeGoto} .pwd=${this.pwd}></view-create-addresses>`
    } else if (this.activePathName === 'recovery-phrase') {
      return html`<view-recovery .pwd=${this.pwd} .phrase=${this.phrase} @routeGoto=${this.routeGoto}></view-recovery>`
    } else if (this.ROUTE?.step === 'unlock') {
      return html`<view-unlock .phrase=${this.phrase} @routeGoto=${this.routeGoto}></view-unlock>`
    } else {
      return html``
    }
  }
  routeGoto = async (e: CustomEvent) => {
    const { path, step, type, pwd, phrase } = e.detail
    if (path === 'generate-addresses' || step == 2) {
      if (type && type === 'unlock') {
        // await walletStore.submitPassword(pwd)
      } else {
        this.pwd = pwd
      }
      // this.phrase = await walletStore.verifySeedPhrase()
    } else if (step == 3) {
      this.pwd = pwd
      this.phrase = phrase
    }

    goto(`/generate-phrase/${step || path}`)
  }

  getIsInitialized = async () => {
    const { seedPhraseBackedUp, isInitialized, isUnlocked } = walletStore.doidState ?? {}
    if (seedPhraseBackedUp) {
      goto('/main')
    }
    // if (!seedPhraseBackedUp) {
    //   goto('/generate-phrase/create-password')
    // }
    if (isInitialized && !seedPhraseBackedUp && !isUnlocked) {
      goto('/generate-phrase/unlock')
      return
    }
    if (isUnlocked) {
      this.phrase = await walletStore.verifySeedPhrase()
    }
  }

  async connectedCallback() {
    super.connectedCallback()
    await this.getIsInitialized()
  }
  render() {
    return html`<div class="gen-phrase">
      <div class="dui-container">
        <div class="dui-container">
          <doid-symbol sm class="block my-4">
            <span slot="h1" class="text-xl"></span>
            <p slot="msg"></p>
          </doid-symbol>
          <div class="max-w-lg mx-auto border-gray-400 border-2 rounded-md mt-10 py-6 p-4">
            ${when(
              this.ROUTE?.step !== 'unlock',
              () => html`
                <ul class="step-line mt-4 -mx-4">
                  ${this.steps.map(
                    (item) =>
                      html`<li
                        class="step-item ${item.pathName === this.activePathName ? 'active' : ''} 
                      ${this.activeRoute?.id && item.id < this.activeRoute.id ? 'finshed' : ''}"
                      >
                        ${item.title}
                      </li>`
                  )}
                </ul>
              `
            )}
            ${this.getStepPage()}
          </div>
        </div>
      </div>
    </div>`
  }
}
