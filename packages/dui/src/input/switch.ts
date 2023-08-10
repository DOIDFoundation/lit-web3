import { customElement, property, state } from 'lit/decorators.js'
import { TailwindElement, html, classMap } from '../shared/TailwindElement'
// Styles
import style from './switch.css?inline'

@customElement('dui-input-switch')
export class DuiInputSwitch extends TailwindElement(style) {
  @property({ type: Boolean }) checked = false
  @property({ type: Boolean, reflect: true }) readonly = false
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: Boolean }) sm = false

  switch = () => {
    if (this.disabled || this.readonly) return
    this.checked = !this.checked
    this.emit('change', this.checked)
  }

  connectedCallback(): void {
    super.connectedCallback()
  }

  render() {
    return html`<span
      title=${this.checked ? 'Enabled' : 'Disabled'}
      ?readonly=${this.readonly}
      ?disabled=${this.disabled}
      @click=${this.switch}
      class="dui-input-switch ${classMap({ checked: this.checked, sm: this.sm })}"
    ></span>`
  }
}
