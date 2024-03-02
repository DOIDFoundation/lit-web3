import { nothing } from 'lit'
import { html, TailwindElement, customElement, createRef, ref, state, when } from '@lit-web3/base/tailwind-element'
import style from './signup.css?inline'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/animation/animation.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'
import './spinner'
import { TransactionExecutionError } from 'viem'
import { ErrNotRegistered, controller, StateController } from '../controller'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.js'

import './connectButtons'
import { DOIDConnectButtons } from './connectButtons'
import { animate } from '@lit-labs/motion'
import { toUnicode } from '@doid/name-validator'

@customElement('doid-signup')
export class DOIDSignup extends TailwindElement([style]) {
  bindController: any = new StateController(this, controller)

  @state() readyToRegister = false
  @state() checking = false
  @state() inputHelpText = ''
  @state() label = 'Enter your desired name to register.'
  @state() showConnect = false
  @state() registering = false

  private inputRef = createRef<SlInput>()
  private checkNameTimer?: any
  private checkNameSeq = 0
  private checkName() {
    if (this.checkNameTimer) clearTimeout(this.checkNameTimer)

    this.inputHelpText = ''
    this.readyToRegister = false
    const name = this.inputRef.value?.value
    if (!name) {
      this.checking = false
      return
    }
    if (/\./.test(name)) {
      this.inputHelpText = '. is not allowed'
      return
    }

    let checkNameSeq = ++this.checkNameSeq
    this.checkNameTimer = setTimeout(() => {
      this.checking = true
      let uts = toUnicode(name)
      if (uts.error) {
        this.inputHelpText = 'Name contains invalid character, try another one.'
        this.checking = false
        return
      }
      if (uts.length < 6) {
        this.inputHelpText = 'Name too short'
        this.checking = false
        return
      }
      this.inputRef.value!.value = uts.domain
      controller.checkDOID(uts.domain).then((ret) => {
        if (checkNameSeq != this.checkNameSeq) return
        this.checking = false
        this.readyToRegister = ret == 'available'
        this.inputHelpText = this.readyToRegister ? '' : `Name is ${ret}, try another one.`
      })
    }, 400)
  }

  private connectButtonsRef = createRef<DOIDConnectButtons>()

  private register = async () => {
    if (!controller.account) {
      this.showConnect = true
      this.updateComplete.then(() => {
        this.connectButtonsRef.value?.on('connect', () => this.register())
        this.connectButtonsRef.value?.on('error', (event: CustomEvent) => {
          if (event.detail instanceof ErrNotRegistered) {
            this.register()
          }
        })
      })
      return
    }
    this.showConnect = false
    this.registering = true
    controller
      .registerDOID(this.inputRef.value?.value!)
      .then((name) => {
        this.emit('success', name)
      })
      .catch((err) => {
        this.registering = false
        if (err instanceof TransactionExecutionError) {
          this.inputHelpText = err.details
        } else {
          this.inputHelpText = err
        }
        console.error(err)
      })
  }
  abort = () => this.emit('abort')

  override render() {
    return html`
      <sl-animation name="fadeIn" easing="ease-in-out" duration="500" play iterations="1">
        <form
          class="mt-6"
          @submit=${(event: Event) => {
            event.preventDefault()
            if (this.readyToRegister) this.register()
          }}
        >
          <h1 class="text-center text-xl mb-4">Register</h1>
          ${when(!this.showConnect, () => html`<p class="text-center">${this.label}</p>`)}
          <sl-input
            autocomplete="off"
            class="mx-auto my-5 max-w-min name"
            @sl-input=${this.checkName}
            ${ref(this.inputRef)}
            autofocus
            .size=${this.showConnect ? 'small' : 'medium'}
            ?readonly=${this.showConnect || this.registering}
            ${animate({ guard: () => this.showConnect })}
          >
            <p slot="suffix" class="mr-2">.doid</p>
            ${when(this.checking || this.registering, () => html`<doid-spinner slot="suffix"></doid-spinner>`)}
            ${when(this.inputHelpText, () => html`<p slot="help-text" class="text-red-500">${this.inputHelpText}</p>`)}
          </sl-input>
          ${when(
            this.showConnect,
            () => html`
              <p class="text-center mb-2">Connect your wallet to finish registering</p>
              <doid-connect-buttons ${ref(this.connectButtonsRef)}></doid-connect-buttons>
            `,
            () => html`
              <div class="relative flex w-full justify-center items-center">
                <sl-button
                  type="submit"
                  variant="primary"
                  ?disabled=${!this.readyToRegister || this.registering}
                  class=${this.registering ? 'cursor-wait' : nothing}
                  >Register</sl-button
                >
                <a class="absolute text-xs -mr-40 cursor-pointer opacity-60 underline" @click=${this.abort}>Abort</a>
              </div>
            `
          )}
        </form>
      </sl-animation>
    `
  }
}
