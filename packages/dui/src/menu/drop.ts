// Todo: ShadowRoot should be created as childNodes of document.body
import { customElement, TailwindElement, html, property, state, classMap, when } from '../shared/TailwindElement'
import type { TAILWINDELEMENT } from '../shared/TailwindElement'
import { animate } from '@lit-labs/motion'

import style from './drop.css?inline'
@customElement('dui-drop')
export class DuiDrop extends TailwindElement(style) implements TAILWINDELEMENT {
  @property({ type: Boolean, reflect: true }) show = false
  @property({ type: Boolean }) alignLeft = false
  @property({ type: Boolean }) md = false

  @state() model = false

  close = async () => {
    this.model = false
    this.unlisten()
    this.emit('close')
  }
  open = async () => {
    this.model = true
    this.listen()
  }

  #clickOutside = (e: Event) => {
    if (
      typeof e.composedPath !== 'function' ||
      !this.parentElement ||
      e.composedPath().includes(this.$('.dui-drop')) ||
      e.composedPath().includes(this.parentElement)
    )
      return
    this.close()
  }
  #onEsc = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return
    e.preventDefault()
    this.close()
  }

  listen() {
    this.unlisten()
    window.addEventListener('click', this.#clickOutside)
    window.addEventListener('touchstart', this.#clickOutside)
    window.addEventListener('keydown', this.#onEsc)
  }
  unlisten() {
    window.removeEventListener('click', this.#clickOutside)
    window.removeEventListener('touchstart', this.#clickOutside)
    window.removeEventListener('keydown', this.#onEsc)
  }

  protected shouldUpdate(props: Map<PropertyKey, unknown>): boolean {
    if (props.has('show')) this.show ? this.open() : this.close()
    return true
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.unlisten()
  }

  override render() {
    return html`<div
      class="dui-drop ${classMap(
        this.$c([
          { 'right-0': !this.alignLeft },
          this.model ? 'mt-auto opacity-100 visible' : '-mt-2 opacity-0 invisible',
          this.md ? '!w-44' : ''
        ])
      )}"
      ${animate({
        guard: () => this.model,
        properties: ['opacity', 'visibility', 'margin', 'transform'],
        keyframeOptions: { duration: 133 }
      })}
    >
      ${when(this.model, () => html`<slot></slot>`)}
    </div>`
  }
}
