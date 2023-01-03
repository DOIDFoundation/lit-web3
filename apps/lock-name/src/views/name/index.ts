import { TailwindElement, html, customElement, property, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto, replace } from '@lit-web3/dui/src/shared/router'
import { nameInfo } from '@lit-web3/ethers/src/nsResolver'
import { wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/nav/nav'
import './register'
import './details'

import style from './name.css?inline'
import emitter from '@lit-web3/core/src/emitter'
@customElement('view-name')
export class ViewName extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: String }) name = ''
  @property() action = ''

  @state() pending = false
  @state() disconnected = false
  @state() nameInfo: NameInfo | null = null

  get inReg() {
    return !bridgeStore.noAccount && this.nameInfo && this.action === 'register'
  }
  get inDetails() {
    return !bridgeStore.noAccount && this.nameInfo && this.action === 'details'
  }

  get empty() {
    return !this.name
  }

  goto = () => {
    replace(`/name/${wrapTLD(this.name)}/${this.action}`)
  }

  check = async (e: unknown, force = false) => {
    if (this.pending) return
    if (await this.isDisconnected(force)) return
    this.pending = true
    const wrapped = wrapTLD(this.name)
    if (this.name !== wrapped) {
      this.name = wrapped
    } else {
      try {
        if (await this.isDisconnected(true)) return
        this.nameInfo = await nameInfo(this.name)
        if (await this.isDisconnected(true)) return
        if (!this.action) this.action = this.nameInfo.available ? 'register' : 'details'
      } catch (err) {
        this.nameInfo = null
      }
    }
    this.goto()
    this.pending = false
  }

  connectedCallback() {
    super.connectedCallback()
    this.check(null, true)
    emitter.on('router-change', this.check)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    emitter.off('router-change', this.check)
  }

  render() {
    return html`<div class="view-name">
      <div class="dui-container">
        <dui-ns-search
          .default=${this.name}
          @search=${(e: CustomEvent) => goto(`/search/${e.detail}`)}
          placeholder="Search DOID names"
        ></dui-ns-search>
        <!-- Tab -->
        ${when(
          this.name,
          () => html`<div class="border-b-2 flex my-4 px-3 pr-4 justify-between items-end">
            <div>
              <b class="text-lg">${this.name}</b>
              ${when(this.name === 'doid', () => html`<em>(Registrant)</em>`)}
            </div>
            <div>
              <dui-nav slot="center" part="dui-nav">
                <dui-link href=${`/name/${this.name}/register`} alias=${`/name/${this.name}`} exact nav
                  >Register</dui-link
                >
                <dui-link href=${`/name/${this.name}/details`} exact nav>Details</dui-link>
              </dui-nav>
            </div>
          </div>`
        )}
        ${when(
          bridgeStore.noAccount,
          () => html`<p class="my-8 text-center"><connect-wallet-btn></connect-wallet-btn></p>`
        )}
        <!-- Register -->
        ${when(
          this.inReg,
          () => html`<view-name-register .name=${this.name} .nameInfo=${this.nameInfo}></view-name-register>`
        )}
        <!-- Details -->
        ${when(
          this.inDetails,
          () => html`<view-name-details .name=${this.name} .info=${this.nameInfo}></view-name-details>`
        )}
      </div>
    </div>`
  }
}
