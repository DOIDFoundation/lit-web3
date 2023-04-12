// Todo: ShadowRoot should be created as childNodes of document.body
import { customElement, TailwindElement, html, property, classMap } from '../shared/TailwindElement'
import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'

import style from './drop.css?inline'
@customElement('dui-drop')
export class DuiDrop extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property({ type: Boolean, reflect: true }) show = false
  @property({ type: Boolean }) alignLeft = false

  hide() {
    this.unlisten()
    this.emit('change', (this.show = false))
  }

  private _chk = (e: Event) => {
    const el = this.$('.doid-drop')
    const outside = typeof e.composedPath === 'function' && !e.composedPath().includes(el)
    if (outside && this.show) this.hide()
  }
  listen() {
    window.addEventListener('click', this._chk)
    window.addEventListener('touchstart', this._chk)
  }
  unlisten() {
    window.removeEventListener('click', this._chk)
    window.removeEventListener('touchstart', this._chk)
  }

  protected shouldUpdate(props: Map<PropertyKey, unknown>): boolean {
    if (props.has('show')) {
      setTimeout(() => (this.show ? this.listen() : this.unlisten()))
    }
    return true
  }
  disconnectedCallback() {
    this.unlisten()
    super.disconnectedCallback()
  }

  override render() {
    return html`<div class="doid-drop ${classMap({ 'right-0': !this.alignLeft })}"><slot></slot></div>`
  }
}
