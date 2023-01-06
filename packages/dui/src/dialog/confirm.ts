import { customElement, TailwindElement, html, Ref, ref, createRef } from '../shared/TailwindElement'
// Component
import './index'
import '../button'

import { DuiDialog } from './index'
import style from './confirm.css?inline'
@customElement('dui-confirm')
// @ts-ignore
export class DuiConfirm extends TailwindElement([DuiDialog.styles, style]) {
  el$: Ref<DuiDialog> = createRef()
  onClose() {
    this.emit('close')
  }
  refClose() {
    this.el$.value?.close()
  }
  confirm() {
    this.emit('confirm')
  }

  override render() {
    return html`<dui-dialog ${ref(this.el$)} @close=${this.onClose}>
      <slot></slot>
      <div slot="footer" class="w-full flex justify-between gap-4">
        <div></div>
        <div>
          <dui-button @click=${this.confirm}>Confirm</dui-button>
          <dui-button @click=${this.refClose} class="minor">Close</dui-button>
        </div>
      </div>
    </dui-dialog>`
  }
}
