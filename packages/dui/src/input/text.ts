import { customElement, property, state } from 'lit/decorators.js'
import { TailwindElement, html, classMap } from '../shared/TailwindElement'

const converter = (val: string | null, type: unknown, { lower = false, upper = false } = {}) => {
  if (val) {
    val = val?.trim()
    if (lower) val = val.toLowerCase()
    else if (upper) val = val.toUpperCase()
  }
  return val
}

import style from './text.css?inline'
@customElement('dui-input-text')
export class DuiInputText extends TailwindElement(style) {
  @property({ type: String }) placeholder = ''
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
  @state() type = 'text'

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

  firstUpdated() {
    if (this.autofocus) {
      const $input = this.$('input')
      $input!.focus()
    }
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

  render() {
    return html`<div
      class="dui-input-text ${classMap(this.$c([this.class, { sm: this.sm, dense: this.dense }]))}"
      ?required=${this.required}
      ?rightSlotted=${this.rightSlotted}
      ?leftSlotted=${this.leftSlotted}
      part="dui-input-text"
    >
      <label><slot name="label" @slotchange=${this.onSlotChange}></slot></label>
      <span class="dui-input-left"><slot name="left" @slotchange=${this.onSlotLeft}></slot></span>
      <input
        .type="${this.type}"
        .disabled="${this.disabled}"
        placeholder="${this.placeholder}"
        value="${this.value}"
        title="${this.title}"
        @focus="${this.onFocus}"
        @input="${this.onInput}"
        @keyup="${this.onKeyup}"
      />
      <div class="dui-input-right"><slot name="right" @slotchange=${this.onSlotRight}></slot></div>
      <div class="dui-input-msg"><slot name="msg" @slotchange=${this.onSlotChange}></slot></div>
      <div class="dui-input-tip"><slot name="tip" @slotchange=${this.onSlotChange}></slot></div>
    </div>`
  }
}
