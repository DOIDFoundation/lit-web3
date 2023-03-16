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
  state = new StateController(this, walletStore)
  constructor() {
    super()
    // goto(`/unlock${location.pathname}`)
    // console.log(location.pathname, 'location.pathname')
  }
  @property() ROUTE?: any
  @property() steps = [
    {
      title: 'Create password',
      id: 1,
      pathName: 'create-password'
    },
    {
      title: 'Generate Addresses',
      id: 2,
      pathName: 'generate-addresses'
    },
    {
      title: 'Confirm secret recovery phrase',
      id: 3,
      pathName: 'recovery-phrase'
    }
  ]
  @property() placeholder = 'Password'
  @state() pwd = ''
  @state() err = ''
  @state() pending = false
  @property() phrase = ''

  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    this.err = msg
    if (error) return
    this.pwd = val
  }

  get activeRoute() {
    const pathName = this.ROUTE?.step === '' ? 'create-password' : this.ROUTE.step
    return this.steps.find((item) => item.pathName === pathName)
  }
  getStepPage() {
    if (this.activeRoute?.pathName === 'create-password') {
      return html`<view-create-pwd @routeGoto=${this.routeGoto}></view-create-pwd>`
    } else if (this.activeRoute?.pathName === 'generate-addresses') {
      return html`<view-create-addresses @routeGoto=${this.routeGoto} .phrase=${this.phrase}></view-create-addresses>`
    } else if (this.activeRoute?.pathName === 'recovery-phrase') {
      return html`<view-recovery .phrase=${this.phrase} @routeGoto=${this.routeGoto}></view-recovery>`
    } else if (this.ROUTE?.step === 'unlock') {
      return html`<view-unlock .phrase=${this.phrase} @routeGoto=${this.routeGoto}></view-unlock>`
    } else {
      return html``
    }
  }
  routeGoto = async (e: CustomEvent) => {
    if (e.detail.path === 'generate-addresses') {
      if (e.detail.type && e.detail.type === 'unlock') {
        // await walletStore.submitPassword(e.detail.pwd)
      } else {
        walletStore.createNewVaultAndKeychain(e.detail.pwd)
      }
      this.phrase = await walletStore.verifySeedPhrase()
    }
    console.log(this.phrase, 'parase')

    goto(`/generate-phrase/${e.detail.path}`)
  }
  getIsInitialized = async () => {
    if (walletStore.doidState.seedPhraseBackedUp) {
      goto('/main')
    }
    // if (!walletStore.doidState.seedPhraseBackedUp) {
    //   goto('/generate-phrase/create-password')
    // }
    if (
      walletStore.doidState.isInitialized &&
      !walletStore.doidState.seedPhraseBackedUp &&
      !walletStore.doidState.isUnlocked
    ) {
      goto('/generate-phrase/unlock')
      return
    }
    if (walletStore.doidState.isUnlocked) {
      this.phrase = await walletStore.verifySeedPhrase()
    }
  }
  async connectedCallback() {
    console.log('callback')

    super.connectedCallback()
    await this.getIsInitialized()
  }
  render() {
    return html`<div class="gen-phrase">
      <div class="dui-container">
        <div class="dui-container">
          <a class="doid-logo mx-auto block w-96 h-20" href="https://doid.tech"></a>
          <div class="max-w-lg mx-auto border-gray-400 border-2 rounded-md mt-10 p-6">
            ${when(
              this.ROUTE?.step !== 'unlock',
              () => html`
                <ul class="step-line mt-4">
                  ${this.steps.map(
                    (item) =>
                      html`<li
                        class="step-item ${item.pathName === this.activeRoute?.pathName ? 'active' : ''} 
                      ${this.activeRoute?.id && item.id < this.activeRoute.id ? 'finshed' : ''}"
                      >
                        ${item.title}
                      </li>`
                  )}
                </ul>
              `
            )}

            <!-- <div>${this.activeRoute}---</div> -->
            ${this.getStepPage()}
          </div>
        </div>
      </div>
    </div>`
  }
}
