import { customElement, TailwindElement, html, property } from '../shared/TailwindElement'
// Components
import './index'

import style from './icon.css?inline'
@customElement('dui-copy-icon')
export class DuiCopyIcon extends TailwindElement(style) {
  @property({ type: String }) value = ''

  override render() {
    return html`<dui-copy .value=${this.value} sm icon
      ><span slot="copied" class="text-green-500">
        <i class="mdi mdi-check-circle-outline"></i>
      </span>
      <span slot="copy"><i class="mdi mdi-content-copy"></i></span
    ></dui-copy>`
  }
}
