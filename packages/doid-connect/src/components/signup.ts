import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'
import TailwindBase from '../tailwind.global.css?inline'
import style from './signup.css?inline'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/animation/animation.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js'
import './spinner'
import { Address, TransactionExecutionError } from 'viem'
import { controller } from '../controller'
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.js'
import EventEmitter from 'eventemitter3'

export interface Events {
  signup(name: string): void
}

@customElement('doid-signup')
export class DOIDSignup extends LitElement {
  @property() account?: Address
  @state() readyToRegister = false
  @state() checking = false
  @state() message = ''

  static styles = [unsafeCSS(TailwindBase), unsafeCSS(style)]

  public readonly events = new EventEmitter<Events>()
  protected emit = this.events.emit.bind(this.events)
  public on = this.events.on.bind(this.events)
  public once = this.events.once.bind(this.events)
  public off = this.events.off.bind(this.events)

  private inputRef: Ref<SlInput> = createRef()
  private checkNameTimer?: any
  private checkNameSeq = 0
  private checkName() {
    if (this.checkNameTimer) clearTimeout(this.checkNameTimer)
    this.checking = true
    this.readyToRegister = false
    let checkNameSeq = ++this.checkNameSeq
    this.checkNameTimer = setTimeout(() => {
      controller.checkDOID(this.inputRef.value?.value!).then((ret) => {
        if (checkNameSeq != this.checkNameSeq) return
        this.checking = false
        this.readyToRegister = ret == 'available'
        this.message = this.readyToRegister ? '' : `Name is ${ret}, try another one.`
      })
    }, 400)
  }

  private register() {
    controller
      .registerDOID(this.inputRef.value?.value!)
      .then((name) => {
        this.emit('signup', name)
      })
      .catch((err) => {
        if (err instanceof TransactionExecutionError) {
          this.message = err.details
        } else {
          this.message = err
          console.error(err)
        }
      })
  }

  override render() {
    return html`
      <sl-animation name="fadeIn" easing="ease-in-out" duration="500" play iterations="1">
        <div class="mt-6">
          <h1 class="text-center text-2xl mb-4">Register</h1>
          ${when(this.account, () => html`<p class="text-center">You don't have a DOID yet.</p>`)}
          <p class="text-center">Enter your desired name to register.</p>
          <sl-input class="mx-auto mt-4 max-w-fit name" @sl-input=${this.checkName} ${ref(this.inputRef)} autofocus>
            <p slot="suffix" class="mr-2">.doid</p>
            ${when(this.checking, () => html`<doid-spinner slot="suffix"></doid-spinner>`)}
            ${when(this.message, () => html`<p slot="help-text" class="text-red-500">${this.message}</p>`)}
          </sl-input>
          <div class="text-center mt-4">
            <sl-button variant="primary" ?disabled=${!this.readyToRegister} @click=${this.register}>Register</sl-button>
          </div>
        </div>
      </sl-animation>
    `
  }
}
