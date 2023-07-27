import { TailwindElement, html, customElement, property, when, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
import { phraseMatch, phraseToAddress } from '~/lib.next/keyring/phrase'
import popupMessenger from '~/lib.next/messenger/popup'

// Components
import '@lit-web3/dui/src/input/text'
import '@lit-web3/dui/src/button'
import '~/components/phrase'
import '~/components/pwd-equal'

const STEP = 2
@customElement('reset-by-step')
export class resetByPhrase extends TailwindElement(null) {
  @property() doid: string | undefined = ''
  @property() address: string = ''
  @property() notify: boolean = true
  @state() phrase = ''
  @state() pwd = ''
  @state() step = 1
  @state() pending = false
  @state() err = ''
  @state() invalid = ''
  @state() unverified = ''

  get wrapName() {
    return this.doid ? wrapTLD(this.doid) : ''
  }
  get btnNextDisabled() {
    return this.pending || this.invalid || !this.phrase || (this.showStep(2) && !this.pwd) || !this.doid
  }
  get errText() {
    return this.showStep(2) && !this.invalid ? this.err : ''
  }
  showStep = (step: number) => this.step === step
  goBack = () => {
    this.step > 1 && this.step--
    this.emit('stepChange', { step: this.step })
  }
  goNext = async () => {
    if (this.step < STEP) {
      this.step++
      this.emit('stepChange', { step: this.step })
    } else {
      await this.doSubmit()
      this.emit('stepChange', { step: this.step, success: 'ok' })
    }
  }
  doSubmit = async () => {
    if (this.pending || !this.doid) return
    this.pending = true
    this.err = ''
    try {
      let addrs = await phraseToAddress(this.phrase)
      const params = {
        name: this.doid,
        json: { addrs },
        pwd: this.pwd,
        phrase: this.phrase,
        reply: this.notify
      }
      if (this.address) Object.assign(params, { address: this.address })
      await popupMessenger.send('internal_recovery', params)
    } catch (e: any) {
      this.err = e
    } finally {
      this.pending = false
    }
  }

  onPhraseChange = async (e: CustomEvent) => {
    e.stopPropagation()
    const { phrase, error } = e.detail as any
    this.invalid = error ?? ''
    if (error) return
    const match = await phraseMatch(phrase, this.address)
    if (match) {
      this.phrase = phrase
    } else {
      this.unverified = "Mnemonic doesn't match."
    }
  }
  onPwdChange = (e: CustomEvent) => {
    e.stopPropagation()
    const { pwd, error } = e.detail
    // this.invalid = error ?? ''
    this.pwd = pwd
  }

  connectedCallback() {
    super.connectedCallback()
  }
  render() {
    return html` <doid-symbol sm class="block mt-12">
        <span slot="h1" class="lg_text-xl"><slot name="title"></slot></span>
        <div slot="msg"><slot name="msg"></slot></div>
      </doid-symbol>
      <!-- <p class="text-red-500">${this.step}---${this.tittlH}</p> -->
      <div class="dui-container">
        <slot name="subtitle"></slot>
        </span>
        ${when(
          this.showStep(1),
          () => html`
            <phrase-to-secret class="my-4" @change=${this.onPhraseChange}>
              <div slot="tip" class="mb-2 p-2 bg-blue-100 border border-blue-300 rounded text-xs">
                You can paste your entire secret phrase into any field
              </div>
            </phrase-to-secret>
            <slot></slot>
          `
        )}
        ${when(this.showStep(2), () => html`<pwd-equal class="mt-8" @change=${this.onPwdChange}></pwd-equal>`)}
      </div>
      ${when(this.unverified, () => html`<div class="text-red-500">${this.unverified}</div>`)}
      ${when(this.errText, () => html`<div class="text-red-500">${this.errText}</div>`)}
      <div class="mt-4 flex justify-between">
        <div>
          ${when(
            !this.showStep(1),
            () => html`
              <dui-button class="w-12 h-12 secondary !rounded-full" @click=${this.goBack} .disabled=${this.pending}
                ><i class="mdi mdi-arrow-left "></i
              ></dui-button>
            `
          )}
        </div>
        <dui-button class="w-12 h-12 secondary !rounded-full" @click=${this.goNext} .disabled=${this.btnNextDisabled}
          ><i class="mdi mdi-arrow-right"></i
        ></dui-button>
      </div>`
  }
}
