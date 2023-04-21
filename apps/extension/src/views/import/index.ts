import { TailwindElement, html, customElement, when, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { accountStore } from '~/store/account'
import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'

// Components
import '~/components/import'

@customElement('view-import')
export class ViewImport extends TailwindElement(null) {
  @state() step = 1

  get account() {
    return accountStore.account
  }
  get accountName() {
    return this.account.name
  }
  get wrapName() {
    return this.accountName ? wrapTLD(this.accountName) : ''
  }
  get isPhraseStep() {
    return this.step === 1
  }
  get titleTop() {
    const title = this.wrapName ? `for ${this.wrapName}` : ''
    return this.isPhraseStep
      ? html`You are importing an address as Main Address ${title}`
      : html`Create password for ${title}`
  }
  get subTitle() {
    return this.isPhraseStep
      ? 'Enter your Secret Recovery Phrase'
      : 'This password will unlock your DOID name(s) only on this device. DOID can not recover this password.'
  }
  get tip() {
    const str = this.wrapName ? `for ${this.wrapName}` : ''
    return this.isPhraseStep
      ? `This Secret Recovery Phrase will be used to generate main addresses ${str} on all chains.`
      : ''
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
    return html`<div>
      <div class="dui-container sparse">
        <reset-by-step .doid=${this.accountName} @stepChange=${this.onStepChange}>
          <span slot="title">${this.titleTop}</span>
          <div slot="subtitle">${this.subTitle}</div>
          <div class="text-xs">${this.tip}</div>
        </reset-by-step>
      </div>
    </div>`
  }
}
