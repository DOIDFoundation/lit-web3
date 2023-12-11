import { TAILWINDELEMENT, state, property, Ref, ref, createRef, classMap } from '../shared/TailwindElement'
import { html, unsafeStatic } from 'lit/static-html.js'

const converter = (val: string | null, type: unknown, { lower = false, upper = false } = {}) => {
  if (val) {
    val = val?.trim()
    if (lower) val = val.toLowerCase()
    else if (upper) val = val.toUpperCase()
  }
  return val
}

declare class EditableElementClass {
  renderHtml: Function
}
export const EditableElement = <T extends PublicConstructor<TAILWINDELEMENT>>(
  superClass: T,
  { tag = 'input' } = {}
) => {
  class myMixin extends superClass {
    el$: Ref<HTMLInputElement> = createRef()
    @property({ type: String }) placeholder = ''
    @property({ type: String }) type = 'text'
    @property({ type: String }) class = ''
    @property({ type: Boolean }) sm = false
    @property({ type: Boolean }) dense = false
    @property({ type: Boolean }) disabled = false
    @property({ type: Boolean }) autofocus = false
    @property({ type: Boolean }) required = false
    @property({ type: Boolean }) lower = false
    @property({ type: Boolean }) upper = false
    @property({ type: Boolean }) err = false
    @property({ type: String, converter }) value = ''
    @property({ type: Number }) debounce = 300

    @state() rightSlotted = false
    @state() leftSlotted = false

    tag = unsafeStatic(tag)

    onSlotChange(e: any) {
      const $slot = e.target
      if (!$slot) {
        return
      }
      const childNodes = $slot.assignedNodes({
        flatten: true
      })
      if (!childNodes.length) {
        // $slot.style.display = 'none'
      }
    }
    onSlotRight(e: any) {
      this.rightSlotted = !!e.target
    }
    onSlotLeft(e: any) {
      this.leftSlotted = !!e.target
    }

    #autofocused = false
    #autofocus() {
      if (!this.autofocus || this.#autofocused) return
      this.#autofocused = true
      setTimeout(() => this.$('input').focus(), 50)
    }

    onFocus(e: any) {
      e.target.select()
    }
    updateVal() {
      const input$ = this.$('input')
      if (input$) input$.value = this.value
    }

    onInput(e: Event) {
      e.stopImmediatePropagation()
      let val = (e.target as HTMLInputElement).value.trim()
      this.value = converter(val, null, { lower: this.lower, upper: this.upper }) || ''
      this.updateVal()
      this.emit('input', val)
    }
    onKeyup = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        this.emit('submit', this.value)
        setTimeout(() => this.updateVal())
      }
    }

    renderDefRight = () => html``
    renderHtml = () => html`<div
      class="dui-input-text ${classMap(this.$c([this.class, { sm: this.sm, dense: this.dense }]))}"
      ?required=${this.required}
      ?rightSlotted=${this.rightSlotted}
      ?leftSlotted=${this.leftSlotted}
      part="dui-input-text"
    >
      <label><slot name="label" @slotchange=${this.onSlotChange}></slot></label>
      <span class="dui-input-left"><slot name="left" @slotchange=${this.onSlotLeft}></slot></span>
      <input
        ${ref(this.el$)}
        .type="${this.type}"
        .disabled="${this.disabled}"
        placeholder="${this.placeholder}"
        value="${this.value}"
        title="${this.title}"
        ?autofocus=${this.autofocus}
        @focus="${this.onFocus}"
        @input="${this.onInput}"
        @keyup="${this.onKeyup}"
      />
      <div class="dui-input-right">
        <slot name="right" @slotchange=${this.onSlotRight}>${this.renderDefRight()}</slot>
      </div>
      <div class="dui-input-msg"><slot name="msg" @slotchange=${this.onSlotChange}></slot></div>
      <div class="dui-input-tip"><slot name="tip" @slotchange=${this.onSlotChange}></slot></div>
    </div>`

    connectedCallback() {
      super.connectedCallback()
      this.#autofocus()
    }

    render() {
      return this.renderHtml()
    }
  }
  return myMixin as PublicConstructor<EditableElementClass> & T
}
