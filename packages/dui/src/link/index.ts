import emitter from '@lit-web3/core/src/emitter'
import { TailwindElement, html, customElement, classMap, property, state, ifDefined } from '../shared/TailwindElement'

const getPathName = (path?: string) => new URL(path ?? location.href).pathname
const getPath = (pathname?: string) => (pathname ?? getPathName()).replace(/^(\/\w+)\/?.*?$/, '$1')

import style from './link.css'
@customElement('dui-link')
export class DuiLink extends TailwindElement(style) {
  @property({ type: String }) target = ''
  @property({ type: String }) class = ''
  @property({ type: String }) href = ''
  @property({ type: String }) alias = ''
  @property({ type: Boolean }) exact = false
  @property({ type: Boolean }) disabled = false
  @property({ type: Boolean }) nav = false // as navigator
  @property({ type: Boolean }) text = false // as text with underline

  @state() pathname = getPathName()

  get blocked() {
    return this.disabled
  }
  get path() {
    return getPath(this.pathname)
  }
  get outsite() {
    return !/^\//.test(this.href)
  }
  get exacted() {
    if (this.outsite) return false
    return this.pathname === getPathName(`${location.origin}${this.href}`) || this.pathname === this.alias
  }
  get active() {
    if (this.outsite) return false
    return getPath(this.href) === this.path || getPath(this.alias) === this.path
  }
  get rel() {
    return this.outsite ? 'noopener' : ''
  }
  get _target() {
    return this.outsite ? '_blank' : ''
  }
  block = (e: Event) => {
    if (this.blocked) e.stopImmediatePropagation()
  }

  updatePathName = () => {
    this.pathname = getPathName()
  }

  connectedCallback() {
    emitter.on('router-change', this.updatePathName)
    this.addEventListener('click', this.block)
    super.connectedCallback()
  }
  disconnectedCallback() {
    emitter.off('router-change', this.updatePathName)
    this.removeEventListener('click', this.block)
    super.disconnectedCallback()
  }

  render() {
    return html`<a
      part="dui-link"
      ?nav=${this.nav}
      ?text=${this.text}
      ?active=${!this.exact && this.active}
      ?exact-active=${this.exacted}
      target="${ifDefined(this._target)}"
      rel="${ifDefined(this.rel)}"
      href="${this.href}"
      class="dui-link ${classMap(this.$c([{ 'router-active': this.active }, this.class]))}"
      ?disabled=${this.disabled}
      ><slot></slot
    ></a>`
  }
}
