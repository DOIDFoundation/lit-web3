import { TailwindElement, html, customElement, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/input/pwd'
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/nav/header'
import '@lit-web3/dui/src/link'
import '~/components/phrase'
import '~/components/pwd-equal'
// import swGlobal from '~/ext.scripts/sw/swGlobal'
import { goto } from '@lit-web3/dui/src/shared/router'

import style from './restore.css?inline'
@customElement('view-restore')
export class ViewRestore extends TailwindElement(style) {
  @state() name = ''
  @state() phrase = ''
  @state() pwd = ''
  @state() invalid: Record<string, string> = { pwd: '', phrase: '' }
  @state() err = ''

  get wrapName() {
    return this.name ? wrapTLD(this.name) : ''
  }
  get restoreDisabled() {
    if (!this.name || !this.phrase || !this.pwd) return true
    return Object.values(this.invalid).some((r) => r)
  }
  onPhraseChange = (e: CustomEvent) => {
    e.stopPropagation()
    const { phrase, error } = e.detail as any
    this.invalid = { ...this.invalid, phrase: error ?? '' }
    this.phrase = phrase
  }
  onPwdChange = (e: CustomEvent) => {
    const { pwd, error } = e.detail
    this.pwd = pwd
    this.invalid = { ...this.invalid, pwd: error ?? '' }
  }

  restore = async () => {
    try {
      // const encodedSeedPhrase = Array.from(Buffer.from(this.phrase, 'utf8').values())
      // await swGlobal.controller.createNewVaultAndRestore(this.name, this.pwd, encodedSeedPhrase)
      goto('/unlock')
    } catch (err: any) {
      this.err = err.message || err
      console.error(err)
    }
  }
  submit() {}
  connectedCallback() {
    super.connectedCallback()
  }
  render() {
    return html`<div class="restore">
      <div class="dui-container">
        <div class="flex items-center">
          <dui-link href="/" class="link"><i class="mdi mdi-arrow-left"></i>Back</dui-link>
        </div>
        <h1 class="my-4 text-4xl">Restore wallet</h1>

        <!-- doid name -->
        <div class="text-base mb-4">
          You are importing an address as Main Address for
          <dui-link class="uri ml-0.5 underline">${this.wrapName}</dui-link>
        </div>

        <h3 class="text-lg">Secret Recovery Phrase</h3>
        <phrase-to-secret class="my-4" @change=${this.onPhraseChange}
          ><div slot="tip" class="mb-2 p-2 bg-blue-100 border border-blue-300 rounded text-xs">
            You can paste your entire secret recovery phrase into any field
          </div></phrase-to-secret
        >

        <div class="lg_max-w-xs">
          <pwd-equal class="mt-8" @change=${this.onPwdChange} @submit=${this.restore}></pwd-equal>
        </div>
        ${when(
          this.err,
          () => html`<div class="-mt-4"></div><span class="text-red-500 text-xs">${this.err}</span></div>`
        )}
        <div class="my-4">
          <dui-button class="secondary" block .disabled=${this.restoreDisabled} @click=${this.restore}
            >Restore</dui-button
          >
        </div>
      </div>
    </div>`
  }
}
