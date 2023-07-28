import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import popupMessenger from '~/lib.next/messenger/popup'
import { openInFullscreen } from '~/lib.next/utils.ext'
import { isUnlock } from '~/lib.next/popup'

// Components
import '@lit-web3/dui/src/input/pwd'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/link'

import style from './unlock.css?inline'
import { StateController, walletStore } from '~/store'
import { goto } from '@lit-web3/dui/src/shared/router'
@customElement('view-unlock')
export class ViewUnlock extends TailwindElement(style) {
  state = new StateController(this, walletStore)
  @property() dest = '/'
  @property() placeholder = 'Password'
  @state() pwd = ''
  @state() err = ''
  @state() pending = true
  @state() pendingBtn = false
  @state() disabled = true

  onInput = async (e: CustomEvent) => {
    const { val = '', error = '', msg = '' } = {}
    this.err = msg
    if (error) return
    // this.pwd = val
    this.pwd = e.detail
    this.disabled = !Boolean(this.pwd)
  }

  unlock = async () => {
    try {
      await popupMessenger.send('unlock', { pwd: this.pwd })
      // if (location.pathname.includes('generate-phrase')) {
      //   this.emit('routeGoto', { path: 'generate-addresses', pwd: this.pwd, type: 'unlock' })
      //   return
      // }
      goto(this.dest)
    } catch (err: any) {
      this.err = err.message ?? err
    }
  }
  forgot = () => openInFullscreen('/restore')

  chk = async () => {
    this.pending = true
    if (await isUnlock()) return goto(this.dest)
    this.pending = false
  }

  connectedCallback() {
    super.connectedCallback()
    this.chk()
  }

  render() {
    return html`<div class="unlock">
      <div class="dui-container">
        <div class="dui-container">
          <doid-symbol class="block mt-24">
            <span slot="h1" class="text-xl">Welcome back!</span>
            <p slot="msg">Your decentralized openid</p>
          </doid-symbol>
          <div class="max-w-xs mx-auto">
            <dui-input-pwd
              autofocus
              type="password"
              @input=${this.onInput}
              @submit=${this.unlock}
              value=${this.pwd}
              placeholder=${this.placeholder}
              ?disabled=${this.pending}
            >
              <span slot="label"><slot name="label"></slot></span>
              <span slot="msg">
                ${when(
                  this.err,
                  () => html`<span class="text-red-500">${this.err}</span>`,
                  () => html`<slot name="msg"></slot>`
                )}
              </span>
            </dui-input-pwd>
            <div class="my-2">
              <dui-button
                class="block w-full secondary !rounded-full h-12"
                @click=${this.unlock}
                ?disabled=${this.disabled}
                block
                >Unlock</dui-button
              >
            </div>
            <p class="text-center my-4 text-xs">
              <dui-link @click=${this.forgot} class="link">Forgot?</dui-link>
            </p>
          </div>
        </div>
      </div>
    </div>`
  }
}
