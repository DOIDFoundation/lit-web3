import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'
import style from './signup.css?inline'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/animation/animation.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'
import './spinner'
import { TransactionExecutionError } from 'viem'
import { ErrNotRegistered, controller } from '../controller'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.js'
import { BaseCss } from './globalCSS'
import './connectButtons'
import { DOIDConnectButtons } from './connectButtons'
import { animate } from '@lit-labs/motion'
import { EventTypes } from '../utils/events'

export interface Events {
  /** @param event.detail name signed up */
  signup(event: CustomEvent<string>): void
}

@customElement('doid-signup')
export class DOIDSignup extends LitElement {
  @state() readyToRegister = false
  @state() checking = false
  @state() inputHelpText = ''
  @state() label = 'Enter your desired name to register.'
  @state() showConnect = false
  @state() registering = false

  static styles = [BaseCss, unsafeCSS(style)]

  // Element Events
  emit<T extends EventTypes.EventNames<Events>>(type: T, detail?: EventTypes.EventArgs<Events, T>, options = []) {
    if (!detail) this.dispatchEvent(new Event(type, { bubbles: false, composed: false, ...options }))
    else this.dispatchEvent(new CustomEvent(type, { detail, bubbles: false, composed: false, ...options }))
  }
  on<T extends EventTypes.EventNames<Events>>(type: T, listener: EventTypes.EventListenerFn<Events, T>, options?: any) {
    this.addEventListener(type, listener as EventListener, options)
  }

  private inputRef: Ref<SlInput> = createRef()
  private checkNameTimer?: any
  private checkNameSeq = 0
  private checkName() {
    if (this.checkNameTimer) clearTimeout(this.checkNameTimer)

    this.inputHelpText = ''
    this.readyToRegister = false
    if (!this.inputRef.value?.value) {
      this.checking = false
      return
    }
    this.checking = true

    let checkNameSeq = ++this.checkNameSeq
    this.checkNameTimer = setTimeout(() => {
      controller.checkDOID(this.inputRef.value?.value!).then((ret) => {
        if (checkNameSeq != this.checkNameSeq) return
        this.checking = false
        this.readyToRegister = ret == 'available'
        this.inputHelpText = this.readyToRegister ? '' : `Name is ${ret}, try another one.`
      })
    }, 400)
  }

  private connectButtonsRef = createRef<DOIDConnectButtons>()

  private register() {
    if (!controller.walletConnected) {
      this.showConnect = true
      this.updateComplete.then(() => {
        this.connectButtonsRef.value?.on('connect', () => this.register())
        this.connectButtonsRef.value?.on('error', (event) => {
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
        this.emit('signup', name)
      })
      .catch((err) => {
        this.registering = false
        if (err instanceof TransactionExecutionError) {
          this.inputHelpText = err.details
        } else {
          this.inputHelpText = err
          console.error(err)
        }
      })
  }

  override render() {
    return html`
      <sl-animation name="fadeIn" easing="ease-in-out" duration="500" play iterations="1">
        <div class="mt-6">
          <h1 class="text-center text-2xl mb-4">Register</h1>
          ${when(!this.showConnect, () => html`<p class="text-center">${this.label}</p>`)}
          <sl-input
            class="mx-auto my-4 max-w-min name"
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
              <div class="text-center">
                <sl-button
                  variant="primary"
                  ?disabled=${!this.readyToRegister || this.registering}
                  @click=${this.register}
                  class=${this.registering ? 'cursor-wait' : nothing}
                  >Register</sl-button
                >
              </div>
            `
          )}
        </div>
      </sl-animation>
    `
  }
}
