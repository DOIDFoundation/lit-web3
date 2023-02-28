import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router/index'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'
import './password'
import './addresses'
import './recovery'

import style from './phrase.css?inline'
import { keyringController, verifySeedPhrase } from '@/lib/keyringController'
@customElement('view-phrase')
export class ViewPhrase extends TailwindElement(style) {
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
  @state() phrase = ''

  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    this.err = msg
    if (error) return
    this.pwd = val
  }

  get activeRoute() {
    const pathName = this.ROUTE?.step === '' ? 'create-password' : this.ROUTE.step
    console.log(pathName, '')
    return this.steps.find((item) => item.pathName === pathName)
  }
  getStepPage() {
    if (this.activeRoute?.pathName === 'create-password') {
      return html`<view-create-pwd @routeGoto=${this.routeGoto}></view-create-pwd>`
    } else if (this.activeRoute?.pathName === 'generate-addresses') {
      return html`<view-create-addresses @routeGoto=${this.routeGoto} .phrase=${this.phrase}></view-create-addresses>`
    } else if (this.activeRoute?.pathName === 'recovery-phrase') {
      return html`<view-recovery .phrase=${this.phrase} @routeGoto=${this.routeGoto}></view-recovery>`
    } else {
      return html``
    }
  }
  routeGoto = async (e: CustomEvent) => {
    console.log(e)
    if (e.detail.path === 'generate-addresses') {
      const res = await keyringController.createNewVaultAndKeychain(e.detail.pwd)
      this.phrase = await verifySeedPhrase()
      console.log(res, this.phrase, '----')
    }
    goto(`/generate-phrase/${e.detail.path}`)
  }
  submit() {}
  render() {
    return html`<div class="gen-phrase">
      <div class="dui-container">
        <div class="dui-container">
          <a class="doid-logo mx-auto block w-96 h-20" href="https://doid.tech"></a>
          <div class="max-w-lg mx-auto border-gray-400 border-2 rounded-md mt-10 p-6">
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
              <!-- <li class="step-item active">Create password</li>
              <li class="step-item">Generate Addresses</li>
              <li class="step-item">Confirm secret recovery phrase</li> -->
            </ul>
            <!-- <div>${this.activeRoute}---</div> -->
            ${this.getStepPage()}
          </div>
        </div>
      </div>
    </div>`
  }
}
