import { customElement, property } from 'lit/decorators.js'
import { TailwindElement, html } from '../shared/TailwindElement'

import style from './text.css'

@customElement('dui-input-text')
export class DuiInputText extends TailwindElement(style) {
  @property({ type: String }) placeholder = ''
  @property({ type: String }) type = 'text'
  @property({ type: String }) class = ''
  @property({ type: String }) value = ''
  @property({ type: Boolean }) disabled = false
  @property({ type: Boolean }) autoforce = false
  @property({ type: Boolean }) required = false
  @property({ type: Boolean }) lower = false
  @property({ type: Boolean }) upper = false
  @property({ type: Boolean }) err = false
  @property({ type: Number }) debounce = 300
  @property({ type: Boolean }) rightSlotted = false

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

  firstUpdated() {
    if (this.autoforce) {
      const $input = this.$('input')
      $input!.focus()
      $input!.select()
    }
  }

  onFocus(e: any) {
    e.target.select()
  }

  onInput(e: any) {
    e.stopImmediatePropagation()
    let val = e.target.value
    if (this.lower) val = val.toLowerCase()
    if (this.upper) val = val.toUpperCase()
    this.value = this.$('input').value = val
    this.emit('input', val)
  }

  render() {
    return html`<div
      class="dui-input-text ${this.class}"
      ?required=${this.required}
      ?rightSlotted=${this.rightSlotted}
      part="dui-input-text"
    >
      <label><slot name="label" @slotchange=${this.onSlotChange}></slot></label>
      <input
        .type="${this.type}"
        .disabled="${this.disabled}"
        placeholder="${this.placeholder}"
        value="${this.value}"
        title="${this.title}"
        @focus="${this.onFocus}"
        @input="${this.onInput}"
      />
      <div class="dui-input-right"><slot name="right" @slotchange=${this.onSlotRight}></slot></div>
      <div class="dui-input-msg"><slot name="msg" @slotchange=${this.onSlotChange}></slot></div>
      <div class="dui-input-tip"><slot name="tip" @slotchange=${this.onSlotChange}></slot></div>
    </div>`
  }
}
