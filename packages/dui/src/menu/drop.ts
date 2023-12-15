// Todo: ShadowRoot should be created as childNodes of document.body
import { customElement, TailwindElement, html, property, state, classMap, when } from '../shared/TailwindElement'
import type { TAILWINDELEMENT } from '../shared/TailwindElement'
import { animate } from '@lit-labs/motion'
// Components
import '../button'

import style from './drop.css?inline'
import { sleep } from '@lit-web3/ethers/src/utils'

const duration = 133

@customElement('dui-drop')
export class DuiDrop extends TailwindElement(style) implements TAILWINDELEMENT {
  @property({ type: Boolean, reflect: true }) show = false
  @property({ type: Boolean }) lg = false
  @property({ type: Boolean }) icon = false
  @property({ type: String }) dropClass = ''
  @property({ type: String }) align = ''
  // Button props
  // TODO: Is there any way to inherit all?
  @property({ type: Boolean, attribute: true }) btnSm = false
  @property({ type: Boolean }) btnText = false
  @property({ type: Boolean }) btnIcon = false
  @property({ type: Boolean }) btnDense = false
  @property({ type: String }) btnTheme?: string
  @property({ type: String }) btnClass = ''

  @state() model = false
  @state() _align = { left: this.align === 'left', top: this.align === 'top' }
  @state() delayedModel = false

  calcPos = () => {
    const pos = this.getBoundingClientRect() ?? {}
    this._align = {
      // Left edge ~= width * 1.2
      left: this.align === 'left' || pos.left < 200,
      // Bottom edge ~= min-height * 1.5
      top: document.documentElement.scrollHeight - pos.y < 16 * 9 * 1.5
    }
  }

  close = async () => {
    this.unlisten()
    this.model = false
    this.emit('close')
    this.emit('change', this.model)
    await sleep(duration)
    this.delayedModel = false
  }
  open = async () => {
    this.delayedModel = true
    this.calcPos()
    this.model = true
    setTimeout(() => this.listen())
    this.emit('open')
    this.emit('change', this.model)
  }
  toggle = () => (this.model ? this.close() : this.open())

  #clickOutside = (e: Event) => {
    if (!e.composedPath?.().includes(this.$('.dui-drop'))) this.close()
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

  connectedCallback() {
    super.connectedCallback()
    if (this.show) this.open()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.unlisten()
    this.close()
  }

  override render() {
    // Here has a problem with shadow DOM's relatvie zIndex, maybe its a bug...
    return html`<div class="inline-block whitespace-nowrap ${classMap({ relative: this.delayedModel })}">
      <div
        class="dui-drop-toggle z-20 inline-flex items-center select-none ${classMap({
          relative: this.delayedModel,
          inverse: this.btnText
        })}"
        @click=${this.toggle}
      >
        <slot name="toggle">
          <dui-button
            ?sm=${this.btnSm}
            ?icon=${this.btnIcon}
            ?dense=${this.btnDense}
            ?text=${this.btnText}
            theme="${this.btnTheme}"
            class="inline-flex items-center space-x-0.5 ${this.btnClass}"
            ><slot name="button"></slot> ${when(
              this.icon,
              () =>
                html`<slot name="icon"
                  ><i
                    class="text-lg -mr-0.5 leading-none mdi mdi-chevron-down ${classMap({
                      'mdi-chevron-down': !this.model,
                      'mdi-chevron-up': this.model,
                      'text-xl': this.lg
                    })}"
                  ></i
                ></slot>`
            )}</dui-button
          >
        </slot>
      </div>
      <div
        part="dui-drop"
        class="dui-drop z-10 ${classMap(
          this.$c([
            this._align.left ? 'left-0' : 'right-0',
            this._align.top ? 'bottom-full' : 'top-full',
            this.model ? 'mt-auto opacity-100 visible' : '-mt-4 opacity-0 invisible hidden',
            this.dropClass
          ])
        )}"
        ${animate({
          guard: () => this.model,
          properties: ['opacity', 'visibility', 'margin', 'display'],
          keyframeOptions: { duration }
        })}
      >
        ${when(this.model, () => html`<slot></slot>`)}
      </div>
    </div>`
  }
}
