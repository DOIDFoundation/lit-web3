import { customElement, ThemeElement, html, Ref, ref, createRef } from '../shared/theme-element'
// Component
import './index'
import '../button'

import { DuiDialog } from './index'
import style from './confirm.css?inline'
@customElement('dui-confirm')
// @ts-ignore
export class DuiConfirm extends ThemeElement([DuiDialog.styles, style]) {
  el$: Ref<DuiDialog> = createRef()
  onClose() {
    this.emit('close')
  }
  close() {
    this.el$.value?.close()
  }
  confirm() {
    this.emit('confirm')
  }

  override render() {
    return html`<dui-dialog ${ref(this.el$)} @close=${this.onClose}>
      <slot slot="header" name="header" class="font-bold"></slot>
      <slot></slot>
      <div slot="footer" class="w-full flex justify-between gap-4">
        <div></div>
        <div>
          <dui-button @click=${this.confirm}>Confirm</dui-button>
          <dui-button @click=${this.close} class="minor">Close</dui-button>
        </div>
      </div>
    </dui-dialog>`
  }
}
