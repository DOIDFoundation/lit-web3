// Todo: ShadowRoot should be created as childNodes of document.body
import { customElement, TailwindElement, html, property, classMap } from '../shared/TailwindElement'

import style from './drop.css?inline'
@customElement('dui-drop')
export class DuiDrop extends TailwindElement(style) {
  @property({ type: Boolean, reflect: true }) show = false
  @property({ type: Boolean }) alignLeft = false

  hide() {
    this.unlisten()
    this.emit('change', (this.show = false))
  }

  #chk = (e: Event) => {
    const el = this.$('.dui-drop')
    const outside = typeof e.composedPath === 'function' && !e.composedPath().includes(el)
    if (outside && this.show) this.hide()
  }

  listen() {
    window.addEventListener('click', this.#chk)
    window.addEventListener('touchstart', this.#chk)
  }
  unlisten() {
    window.removeEventListener('click', this.#chk)
    window.removeEventListener('touchstart', this.#chk)
  }

  protected shouldUpdate(props: Map<PropertyKey, unknown>): boolean {
    if (props.has('show')) {
      this.show ? this.listen() : this.unlisten()
    }
    return true
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    this.unlisten()
  }

  override render() {
    return html`<div class="dui-drop ${classMap({ 'right-0': !this.alignLeft })}"><slot></slot></div>`
  }
}
