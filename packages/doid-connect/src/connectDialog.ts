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
import { options } from './options'
import { doidTestnet } from './chains'
import commonCSS from './assets/css'

const shortAddress = (address?: string, { leftLen = 6, rightLen = 4 } = {}) => {
  if (!address) return
  const len = address.length
  return `${address.substring(0, leftLen)}...${address.substring(len - rightLen, len)}`
}

@customElement('doid-connect-dialog')
export class DOIDConnectDialog extends TailwindElement([...commonCSS, style]) {
  bindState: any = new StateController(this, controller)

  @property({ reflect: true }) scene = '' // scene = '' or 'signup'
  @property() chainId?: Chain['id']

  @state() cur: Record<string, string> | null = null
  @state() mode = this.scene

  private dialogRef = createRef<SlDialog>()

  get inSignupMode() {
    return this.mode === 'signup'
  }

  changeMode = (scene: string = '') => {
    this.mode = scene
    this.emit('scene', scene)
  }
  back = () => {
    this.changeMode()
    controller.disconnect()
  }
  toSignup = () => {
    this.changeMode('signup')
  }

  firstUpdated() {
    this.dialogRef.value?.show()
  }

  protected shouldUpdate(props: Map<PropertyKey, unknown>): boolean {
    if (props.has('cur')) {
      // Autoclose if changed account already signed up
      const curAccount = (props.get('cur') as any)?.account
      const changed = curAccount && curAccount !== controller.account
      if (changed && controller.doid) {
        this.emit('connect')
        this.close()
        return false
      }
    }
    if (props.has('scene')) {
      this.mode = this.scene
    }
    return true
  }

  close() {
    this.emit('close')
    this.dialogRef.value?.hide().then(() => {})
    this.remove()
  }
  beforeClose = (e: CustomEvent) => {
    if (e.detail.source === 'overlay' && this.inSignupMode) e.preventDefault()
  }

  unwatch = () => {}
  connectedCallback() {
    super.connectedCallback()
    this.unwatch = controller.subscribe(
      (key, val) => {
        this.cur = { ...this.cur, [key]: val }
      },
      ['account', 'doid']
    )
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    this.unwatch()
  }

  onConnected = (e: CustomEvent) => {
    this.emit('connect', e.detail)
    this.close()
  }
  onConnectError = (e: CustomEvent) => {
    let error = e.detail
    if (error instanceof ErrNotRegistered) {
      this.toSignup()
    } else {
      this.emit('error', error)
    }
  }
  onSuccess = async () => {
    try {
      const data = await controller.connect({ chainId: this.chainId })
      this.emit('connect', data)
      this.close()
    } catch (err: any) {
      this.emit('error', err)
    }
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
      <div class="h-80">
        <!-- Connector Selection -->
        <div class="icon w-16 h-16 mx-auto mt-5 relative">
          ${doidSvg}
          ${when(
            options.doidNetwork?.id == doidTestnet.id,
            () => html`<sl-badge variant="danger" class="absolute text-xs -top-2 -right-12">testnet</sl-badge>`
          )}
        </div>
        <!-- Signup mode -->
        ${when(
          this.inSignupMode,
          () =>
            html`<doid-signup
              @abort=${this.back}
              .label=${html`You need to register a DOID account for <b>${shortAddress(controller.account)}</b> to use
                full services of this website.`}
              @success=${this.onSuccess}
            ></doid-signup>`,
          this.renderConnect
        )}
      </div>
    </sl-dialog>`
  }

  renderConnect = () => html`
    <div class="my-6 text-center font-medium">
      <h1 class="text-2xl mb-4">Welcome</h1>
      ${when(
        options.appName,
        () => html`<p>Unlock your DOID to continue to ${options.appName}.</p>`,
        () => html`<p>Unlock your DOID to continue.</p>`
      )}
    </div>
    <div class="px-5 pb-5 mt-2 text-center font-medium">
      <doid-connect-buttons
        .chainId=${this.chainId}
        @connect=${this.onConnected}
        @error=${this.onConnectError}
      ></doid-connect-buttons>
      <div class="separator my-4"></div>
      Learn more about <a href="https://doid.tech" class="link" target="_blank">DOID</a>
    </div>
  `
}
