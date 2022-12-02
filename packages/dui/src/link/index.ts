import emitter from '@lit-web3/core/src/emitter'
import { TailwindElement, html, customElement, classMap } from '../shared/TailwindElement'
import { property, state } from 'lit/decorators.js'
import style from './index.css'

const getPathName = (path?: string) => {
  let { pathname } = new URL(path ?? location.href)
  return pathname
}

@customElement('dui-link')
export class DuiLink extends TailwindElement(style) {
  @property({ type: String }) target = ''
  @property({ type: String }) class = ''
  @property({ type: String }) href = ''
  @property({ type: Boolean }) disabled = false
  @property({ type: Boolean }) nav = false

  @state() pathname = getPathName()

  constructor() {
    super()
    // this.addEventListener('click', (e: Event) => {
    //   if (this.blocked) {
    //     e.stopImmediatePropagation()
    //   }
    // })
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
    // const target = this.target ? html`target=${this.target}` : ``
    return html`<a
      part="dui-link"
      ?nav=${this.nav}
      ?active=${this.active}
      href="${this.href}"
      class="dui-link ${classMap({ 'router-active': this.active })}"
      ><slot></slot
    ></a>`
  }
}
