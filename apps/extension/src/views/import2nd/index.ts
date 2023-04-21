import { TailwindElement, html, customElement, when, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { accountStore } from '~/store/account'
import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'

// Components
import '~/components/import'

import style from './import2nd.css?inline'
@customElement('import-2nd')
export class ViewImport extends TailwindElement(style) {
  @state() step = 1

  get account() {
    return accountStore.account
  }
  get accountName() {
    return this.account.name
  }
  get ownerAddr() {
    return this.account.owner.toLowerCase()
  }
  get wrapName() {
    return this.accountName ? wrapTLD(this.accountName) : ''
  }
  get isPhraseStep() {
    return this.step === 1
  }

  onStepChange(e: CustomEvent) {
    const { step, success } = e.detail as any
    this.step = step
    if (success) {
      goto('/unlock')
    }
  }
  connectedCallback() {
    super.connectedCallback()
  }
  render() {
    return html` <div>
      <div class="dui-container sparse">
        <reset-by-step
          .doid=${this.accountName}
          .address=${this.ownerAddr}
          check="true"
          @stepChange=${this.onStepChange}
        >
          <!-- phrase -->
          ${when(
            this.isPhraseStep,
            () => html`
              <div slot="title">You are setting</div>
              <div slot="msg">
                <span class="text-xs">${this.ownerAddr}</span>
                <div>as main address for EVM chains<b>${this.wrapName ? ` for ${this.wrapName}` : ''}</b></div>
              </div>
              <div slot="subtitle">Enter your Secret Recovery Phrase</div>
            `
          )}
          <!-- pwd -->
          ${when(
            !this.isPhraseStep,
            () => html`
              <div slot="title">Create password</div>
              <div slot="msg">
                <div class="text-xs">
                  This password will unlock your DOID name(s) only on this device. DOID can not recover this password.
                </div>
              </div>
            `
          )}
        </reset-by-step>
      </div>
    </div>`
  }
}
