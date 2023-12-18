import { customElement, TailwindElement, html, when, state } from '../shared/TailwindElement'
// Component
import '../dialog/prompt'
import '../button'

@customElement('dui-tip')
export class DuiTip extends TailwindElement('') {
  @state() model = false

  show() {
    this.model = true
  }
  onClose() {
    this.model = false
    this.emit('close')
  }

  override render() {
    return html`<slot name="button" @click=${this.show}
        ><dui-button icon
          ><slot name="icon"><i class="mdi mdi-help-circle-outline cursor-pointer"></i></slot></dui-button></slot
      >${when(
        this.model,
        () =>
          html`<dui-prompt @close=${this.onClose}>
            <slot></slot>
          </dui-prompt>`
      )}`
  }
}
