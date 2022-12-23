import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import { commit, getCommitment, clearCommitment, register, now } from '@lit-web3/ethers/src/nsResolver/registrar'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '@lit-web3/dui/src/doid-claim-name'
import '@lit-web3/dui/src/progress/bar'

import style from './register.css?inline'
@customElement('view-name-register')
export class ViewNameRegister extends TailwindElement(style) {
  @property() name = ''
  @property({ type: Object }) nameInfo!: NameInfo
  @state() done = false
  @state() pending = false
  @state() err = ''
  @state() ts = 0
  @state() step = 1
  @state() tx: any = null
  @state() commitment: Commitment | any = {}
  @state() cd = 0
  @state() timer: any = null

  get btn() {
    return {
      disabled: this.err || this.pending || this.step === 2,
      title: this.done ? 'Manage name' : this.step > 1 ? 'Register' : 'Request to Register'
    }
  }
  get txSuccess() {
    return this.tx && !this.tx.ignored
  }
  get lockedByMe() {
    const { locked, itsme } = this.nameInfo
    return locked && itsme
  }
  get detailsLink() {
    return `/name/${this.name}/details`
  }

  get txPending() {
    return this.tx && !this.tx?.ignored
  }

  get percent() {
    if (this.done) return 100
    if (this.step === 1) {
      if (this.pending && !this.tx) return 2
      if (this.tx) return 5
    }
    if (this.step === 2) return 35
    if (this.step === 3) {
      if (this.pending && !this.tx) return 70
      if (this.tx) return 75
    }
    if (this.step === 3) return 68
    return 0
  }
  get randomTo() {
    if (this.step === 1 && this.tx) return 35
    if (this.step === 2) return 68
    if (this.step === 3 && this.tx) return 99
    return 0
  }
  goStep2 = () => {
    this.step = 2
    const cd = 60
    this.cd = cd
    this.timer = setInterval(() => {
      if (this.cd-- <= 0) this.goStep3()
    }, 1000)
  }
  goStep3 = () => {
    this.step = 3
    clearInterval(this.timer)
  }

  getCommitment = async () => {
    this.commitment = (await getCommitment(this.name)) || {}
  }

  get = async () => {
    await this.getCommitment()
    const { secret, ts } = this.commitment
    if (ts && (now() - ts ?? 0) > 60 * 1000) this.goStep3()
    else if (secret) this.goStep2()
    this.ts++
  }
  commit = async () => {
    this.pending = true
    this.err = ''
    try {
      this.tx = await commit(this.name)
      await this.tx.wait()
      this.goStep2()
    } catch (err: any) {
      if (err.code !== 4001) {
        if (/( IC)/.test(err.message)) {
          this.err = 'This name is already committed by someone else, please try again later'
        }
      }
      clearCommitment(this.name)
      this.tx = null
    } finally {
      this.pending = false
    }
  }

  register = async () => {
    if (this.done) return goto(`/name/${this.name}/details`)
    if (this.step !== 3) return this.commit()
    this.pending = true
    this.err = ''
    try {
      this.tx = await register(this.name)
      this.done = await this.tx.wait()
    } catch (err: any) {
      if (err.code !== 4001) {
        this.err = err.message
      }
      this.tx = null
    } finally {
      this.pending = false
    }
  }

  go2success = () => {
    goto(this.detailsLink)
  }

  connectedCallback() {
    super.connectedCallback()
    this.get()
  }

  render() {
    if (!this.nameInfo.available)
      return html`${when(
        this.nameInfo.itsme,
        () => html`<div class="px-3">
          <dui-button class="secondary" href=${this.detailsLink}
            >Manage your name <i class="mdi mdi-chevron-right"></i
          ></dui-button>
        </div>`,
        () => html`<div class="px-3">
          This DOID name is already taken. <dui-link class="mx-1" href=${this.detailsLink}>See Details</dui-link>
        </div>`
      )}`
    if (this.lockedByMe)
      return html`<div class="px-3">
        <h3 class="text-base mb-4">${`This DOID name is already locked by pass #${this.nameInfo.locked}`}</h3>
        <doid-claim-name @success=${this.go2success} .nameInfo=${this.nameInfo}>Claim this name</doid-claim-name>
      </div>`
    return html`<div class="px-3">
      <h3 class="text-base">
        ${this.done
          ? 'You’ve completed all the steps, manage your name now!'
          : 'Registering a name requires you to complete 3 steps'}
      </h3>
      <ol>
        <li class="${classMap({ done: this.done || this.step > 1, active: this.step >= 1 })}">
          <b>Request to register</b>
          <p>
            Your wallet will open and you will be asked to confirm the first of two transactions required for
            registration. If the second transaction is not processed within 7 days of the first, you will need to start
            again from step 1.
          </p>
        </li>
        <li class="${classMap({ done: this.done || this.step > 2, active: this.step >= 2 })}">
          <b>Wait for ${this.cd ? `${this.cd} seconds` : '1 minute'}</b>
          <p>
            The waiting period is required to ensure another person hasn’t tried to register the same name and protect
            you after your request.
          </p>
        </li>
        <li class="${classMap({ done: this.done, active: this.step >= 3 })}">
          <b>Complete Registration</b>
          <p>
            Click ‘register’ and your wallet will re-open. Only after the 2nd transaction is confirmed you'll know if
            you got the name.
          </p>
        </li>
      </ol>
      <progress-bar .percent=${this.percent} .randomTo=${this.randomTo} class="my-4"></progress-bar>
      <div class="my-4 flex justify-center items-center h-9">
        <dui-button
          @click=${this.register}
          ?disabled=${this.btn.disabled}
          class="${classMap({ secondary: this.done })}"
          ?pending=${this.pending}
          >${this.btn.title}${when(
            this.cd,
            () => html`<span class="ml-2">(${this.cd})</span>`,
            () =>
              html`<i class="mdi ml-2 ${classMap(this.$c([this.pending ? 'mdi-loading' : 'mdi-chevron-right']))}"></i>`
          )}
        </dui-button>
      </div>
      <div class="text-center">
        ${when(this.done, () => html`<p class="text-green-600">Success!</p>`)}
        ${when(this.err, () => html`<p class="text-red-500">${this.err}</p>`)}
      </div>
    </div>`
  }
}
