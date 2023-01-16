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
  }

  override render() {
    return html`<dui-button @click=${this.show} sm icon
        ><i class="text-base mdi mdi-help-circle-outline cursor-pointer"></i></dui-button
      >${when(
        this.model,
        () => html`<dui-prompt @close=${this.onClose}>
          <slot></slot>
        </dui-prompt>`
      )}`
  }
}
