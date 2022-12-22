import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  classMap
} from '@lit-web3/dui/src/shared/TailwindElement'
import { commit, getCommitment } from '@lit-web3/ethers/src/nsResolver/registrar'
// Components

import style from './register.css?inline'
@customElement('view-name-register')
export class ViewNameRegister extends TailwindElement(style) {
  @property() name = ''
  @state() pending = false
  @state() ts = 0
  @state() step = 1
  @state() tx: any = null

  get btnDisabled() {
    return this.pending
  }
  get txSuccess() {
    return this.tx && !this.tx.ignored
  }

  get = async () => {
    this.ts++
  }
  commit = async () => {
    this.pending = true
    try {
      this.tx = await commit(this.name)
      const success = await this.tx.wait()
      this.step = 2
    } catch (err: any) {
      if (err.code === '4001') return
      if (/( IC)/.test(err.message)) {
        this.step = 2
      }
    } finally {
      this.pending = false
    }
  }

  connectedCallback() {
    this.get()
    super.connectedCallback()
  }

  render() {
    return html`<div class="px-3">
      <h3 class="text-base">Registering a name requires you to complete 3 steps</h3>
      <ol>
        <li class="${classMap({ active: this.step >= 1 })}">
          <b>Request to register</b>
          <p>
            Your wallet will open and you will be asked to confirm the first of two transactions required for
            registration. If the second transaction is not processed within 7 days of the first, you will need to start
            again from step 1.
          </p>
        </li>
        <li class="${classMap({ active: this.step >= 2 })}">
          <b>Wait for 1 minute</b>
          <p>
            The waiting period is required to ensure another person hasn’t tried to register the same name and protect
            you after your request.
          </p>
        </li>
        <li class="${classMap({ active: this.step === 3 })}">
          <b>Complete Registration</b>
          <p>
            Click ‘register’ and your wallet will re-open. Only after the 2nd transaction is confirmed you'll know if
            you got the name.
          </p>
        </li>
      </ol>
      <p class="text-center">
        <dui-button @click=${this.commit} ?disabled=${this.btnDisabled} ?pending=${this.pending}
          >Request to Register<i
            class="mdi ml-2 ${classMap(this.$c([this.pending ? 'mdi-loading' : 'mdi-chevron-right']))}"
          ></i>
        </dui-button>
      </p>
    </div>`
  }
}
