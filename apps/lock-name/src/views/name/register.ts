import { TailwindElement, html, customElement, property, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components

import style from './register.css?inline'
@customElement('view-name-register')
export class ViewNameRegister extends TailwindElement(style) {
  @property() name = ''

  @state() pending = false
  @state() ts = 0

  get empty() {
    return false
  }

  get = async () => {
    this.ts++
  }

  connectedCallback() {
    this.get()
    super.connectedCallback()
  }

  render() {
    return html`<div class="px-3">
      <h3 class="text-base">Registering a name requires you to complete 3 steps</h3>
      <ol>
        <li>
          <b>Request to register</b>
          <p>
            Your wallet will open and you will be asked to confirm the first of two transactions required for
            registration. If the second transaction is not processed within 7 days of the first, you will need to start
            again from step 1.
          </p>
        </li>
        <li>
          <b>Wait for 1 minute</b>
          <p>
            The waiting period is required to ensure another person hasn’t tried to register the same name and protect
            you after your request.
          </p>
        </li>
        <li>
          <b>Complete Registration</b>
          <p>
            Click ‘register’ and your wallet will re-open. Only after the 2nd transaction is confirmed you'll know if
            you got the name.
          </p>
        </li>
      </ol>
      <dui-button>Request to Register</dui-button>
    </div>`
  }
}
