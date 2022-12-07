import emitter from '@lit-web3/core/src/emitter'
import { TailwindElement, html, customElement, classMap, property, state, ifDefined } from '../shared/TailwindElement'

const getPathName = (path?: string) => new URL(path ?? location.href).pathname

import style from './link.css'
@customElement('dui-link')
export class DuiLink extends TailwindElement(style) {
  @property({ type: String }) target = ''
  @property({ type: String }) class = ''
  @property({ type: String }) href = ''
  @property({ type: Boolean }) disabled = false
  @property({ type: Boolean }) nav = false // as navigator
  @property({ type: Boolean }) text = false // as text with underline

  @state() pathname = getPathName()

  constructor() {
    super()
    this.addEventListener('click', (e: Event) => {
      if (this.blocked) e.stopImmediatePropagation()
    })
  }
  get blocked() {
    return this.disabled
  }

  get active() {
    return this.pathname.replace(/\/$/, '') === this.href.replace(/\/$/, '')
  }
  get isExact() {
    return this.pathname === this.href
    // add class
  }
  get rel() {
    return this.target ? 'noopener' : ''
  }

  updatePathName() {
    this.pathname = getPathName()
  }
  connectedCallback(): void {
    super.connectedCallback()
    emitter.on('router-change', () => this.updatePathName())
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
  }
  firstUpdated() {}

  render() {
    return html`<a
      part="dui-link"
      ?nav=${this.nav}
      ?text=${this.text}
      ?active=${this.active}
      target=${this.target}
      rel="${ifDefined(this.rel)}"
      href="${this.href}"
      class="dui-link ${classMap(this.$c([{ 'router-active': this.active }, this.class]))}"
      ?disabled=${this.disabled}
      ><slot></slot
    ></a>`
  }
}
