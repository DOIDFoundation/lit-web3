import { customElement, TailwindElement, html, when, ref, createRef, property, Ref } from '../shared/TailwindElement'
// Component
import './index'
import '../button'

import { DuiDialog } from './index'
import style from './prompt.css?inline'
@customElement('dui-prompt')
// @ts-ignore
export class DuiPrompt extends TailwindElement([DuiDialog.styles, style]) {
  @property({ type: Boolean }) button = false
  el$: Ref<DuiDialog> = createRef()
  onClose() {
    this.emit('close')
  }
  refClose() {
    this.el$.value?.close()
  }

  override render() {
    return html`<dui-dialog ${ref(this.el$)} @close=${this.onClose}>
      <slot></slot>
      ${when(
        this.button,
        () => html`<div slot="footer" class="w-full flex justify-between gap-4">
          <div></div>
          <div>
            <dui-button @click=${this.refClose} class="minor">Close</dui-button>
          </div>
        </div>`
      )}
    </dui-dialog>`
  }
}
