import {
  TailwindElement,
  html,
  customElement,
  property,
  state,
  when,
  repeat
} from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '@lit-web3/dui/src/ns-search'
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/nav/nav'
import './register'
import './details'

import style from './name.css?inline'
@customElement('view-name')
export class ViewName extends TailwindElement(style) {
  @property() name = ''
  @property() action = ''

  @state() pending = false
  @state() ts = 0

  get inReg() {
    return this.name && this.action === 'register'
  }
  get inDetails() {
    return this.name && this.action === 'details'
  }

  get empty() {
    return !this.name
  }

  get = async () => {
    if (this.name && !this.action) {
      goto(`/name/${this.name}/register`)
    }
    this.ts++
  }

  connectedCallback() {
    this.get()
    super.connectedCallback()
  }

  render() {
    return html`<div class="view-name">
      <div class="dui-container">
        <dui-ns-search
          .text=${this.name}
          @search=${(e: CustomEvent) => goto(`/name/${e.detail}`)}
          placeholder="Search names"
        >
          <span slot="label"></span>
          <span slot="msgd"></span>
        </dui-ns-search>
        <!-- Pending -->
        ${when(this.pending, () => html`<i class="mdi mdi-loading"></i> Searching...`)}
        <!-- Tab -->
        ${when(
          this.name,
          () => html`<div class="border-b-2 flex my-4 px-3 pr-4 justify-between">
            <div>
              <b>${this.name}</b>
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
        <!-- Register -->
        ${when(this.inReg, () => html`<view-name-register .name=${this.name}></view-name-register>`)}
        <!-- Details -->
        ${when(this.inDetails, () => html`<view-name-details .name=${this.name}></view-name-details>`)}
      </div>
    </div>`
  }
}
