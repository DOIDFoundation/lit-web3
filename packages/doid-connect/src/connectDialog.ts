import { LitElement, PropertyValueMap, html, nothing, svg, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import './components/signup'
import './components/connectButtons'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import themeDark from '@shoelace-style/shoelace/dist/themes/dark.styles.js'
import themeLight from '@shoelace-style/shoelace/dist/themes/light.styles.js'
import { Chain } from '@wagmi/core'
import style from './connectDialog.css?inline'
import { doidSvg } from './assets/svg/doid'
import { ErrNotRegistered, controller } from './controller'
import { createRef, ref } from 'lit/directives/ref.js'
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import { DOIDSignup } from './components/signup'
import { Events as ConnectEvents, DOIDConnectButtons } from './components/connectButtons'
import { BaseCss } from './components/globalCSS'
import { options } from './options'
import { EventTypes } from './utils/events'

export interface Events extends ConnectEvents {
  close: EventTypes.VoidEvent
}

@customElement('doid-connect-dialog')
export class DOIDConnectDialog extends LitElement {
  @property({ type: Boolean }) signup = false
  @property() chainId?: Chain['id']
  @state() connectedWithoutDOID = false

  static styles = [BaseCss, unsafeCSS(style), themeLight, themeDark]

  // Element Events
  emit<T extends EventTypes.EventNames<Events>>(type: T, detail?: EventTypes.EventDetailType<Events, T>, options = []) {
    if (!detail) this.dispatchEvent(new Event(type, { bubbles: false, composed: false, ...options }))
    else this.dispatchEvent(new CustomEvent(type, { detail, bubbles: false, composed: false, ...options }))
  }
  on<T extends EventTypes.EventNames<Events>>(type: T, listener: EventTypes.EventListenerFn<Events, T>, options?: any) {
    this.addEventListener(type, listener as EventListener, options)
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)
    this.show()
  }

  private dialogRef = createRef<SlDialog>()
  private signupRef = createRef<DOIDSignup>()
  private connectButtonsRef = createRef<DOIDConnectButtons>()

  /**
   * @fires connect
   * @fires error
   */
  show() {
    return this.updateComplete.then(() => {
      this.connectButtonsRef.value?.on('connect', (event) => {
        this.emit('connect', event.detail)
        this.close()
      })
      this.connectButtonsRef.value?.on('error', async (event) => {
        let error = event.detail
        if (error instanceof ErrNotRegistered) {
          this.connectedWithoutDOID = true
          await this.showSignup()
        } else {
          this.emit('error', error)
        }
      })
      return this.dialogRef.value?.show()
    })
  }

  private async showSignup() {
    this.signup = true
    await this.updateComplete
    this.signupRef.value!.on('signup', () => {
      controller
        .connect({ chainId: this.chainId })
        .then((data) => {
          this.emit('connect', data)
          this.close()
        })
        .catch((e) => this.emit('error', e))
    })
  }

  /**
   * @fires close
   */
  close() {
    this.dialogRef.value?.hide().then(() => {
      this.remove()
      this.emit('close')
    })
  }

  override render() {
    return html`<sl-dialog
      label="Connect your DOID"
      no-header
      @sl-after-hide=${this.close}
      ${ref(this.dialogRef)}
      class="${options.themeMode == 'dark' ? 'sl-theme-dark' : 'sl-theme-light'}"
    >
      <div class="icon w-16 h-16 mx-auto mt-5">${doidSvg}</div>
      ${when(
        !this.signup,
        this.renderConnect.bind(this),
        () =>
          html`<doid-signup
            .label=${this.connectedWithoutDOID ? "You don't have a DOID yet, consider registering one." : nothing}
            ${ref(this.signupRef)}
          ></doid-signup>`
      )}
    </sl-dialog>`
  }

  renderConnect() {
    return html`
      <div class="my-6 text-center font-medium">
        <h1 class="text-2xl mb-4">Welcome</h1>
        ${when(
          options.appName,
          () => html`<p>Unlock your DOID to continue to ${options.appName}.</p>`,
          () => html`<p>Unlock your DOID to continue.</p>`
        )}
      </div>
      <div class="px-5 pb-5 mt-2 text-center font-medium">
        <doid-connect-buttons .chainId=${this.chainId} ${ref(this.connectButtonsRef)}></doid-connect-buttons>
        <div class="separator mt-4"></div>
        <p>Don't have a DOID?</p>
        <sl-button variant="text" @click=${() => this.showSignup()}>Sign up</sl-button>
      </div>
    `
  }
}
