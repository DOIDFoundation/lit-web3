import { PropertyValueMap, nothing } from 'lit'
import {
  html,
  TailwindElement,
  customElement,
  property,
  state,
  when,
  createRef,
  ref,
  classMap
} from '@lit-web3/base/tailwind-element'
import './components/signup'
import './components/connectButtons'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/badge/badge'
import '@shoelace-style/shoelace/dist/components/popup/popup.js'
import { Chain } from '@wagmi/core'
import style from './connectDialog.css?inline'
import { doidSvg } from './assets/svg/doid'
import { ErrNotRegistered, controller, StateController } from './controller'
import SlDialog from '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import { DOIDSignup } from './components/signup'
import { DOIDConnectButtons } from './components/connectButtons'
import { options } from './options'
import { doid } from './chains'
import commonCSS from './assets/css'

const shortAddress = (address?: string, { leftLen = 6, rightLen = 4 } = {}) => {
  if (!address) return
  const len = address.length
  return `${address.substring(0, leftLen)}...${address.substring(len - rightLen, len)}`
}

@customElement('doid-connect-dialog')
export class DOIDConnectDialog extends TailwindElement([...commonCSS, style]) {
  bindState: any = new StateController(this, controller)

  @property({ type: Boolean }) signup = false
  @property() chainId?: Chain['id']

  @state() connectedWithoutDOID = false

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
      this.connectButtonsRef.value?.on('connect', (event: CustomEvent) => {
        this.emit('connect', event.detail)
        this.close()
      })
      this.connectButtonsRef.value?.on('error', async (event: CustomEvent) => {
        let error = event.detail
        if (error instanceof ErrNotRegistered) {
          this.connectedWithoutDOID = true
          // Close if accountChanged
          controller.subscribe(async (_, acc) => {
            this.close()
          }, 'account')
          this.showSignup()
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
  beforeClose = (e: CustomEvent) => {
    if (e.detail.source === 'overlay' && this.connectedWithoutDOID) e.preventDefault()
  }
  connectedCallback() {
    super.connectedCallback()
  }

  override render() {
    return html`<sl-dialog
      label="Connect your DOID"
      no-header
      @sl-request-close=${this.beforeClose}
      @sl-after-hide=${this.close}
      ${ref(this.dialogRef)}
      class="${classMap(this.$c([options.themeMode == 'dark' ? 'sl-theme-dark' : 'sl-theme-light']))}"
    >
      <div class="icon w-16 h-16 mx-auto mt-5 relative">
        ${doidSvg}
        ${when(
          options.doidNetwork?.id == doid.id,
          () => html`<sl-badge class="neutral absolute text-xs -top-2 -right-10">beta</sl-badge>`,
          () => html`<sl-badge class="danger absolute text-xs -top-2 -right-12">testnet</sl-badge>`
        )}
      </div>
      ${when(
        !this.signup,
        this.renderConnect.bind(this),
        () =>
          html`<doid-signup
            .label=${this.connectedWithoutDOID
              ? html`You need to register a DOID account for <b>${shortAddress(controller.account)}</b> to use full
                  services of this website.`
              : nothing}
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
