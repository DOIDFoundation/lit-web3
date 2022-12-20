import { TailwindElement, html, customElement } from '../shared/TailwindElement'
// Components
import '../connect-wallet/btn'
import '../block-number'
import '../network-warning'
import '../link'

import style from './header.css'

@customElement('dui-header')
export class DuiHeader extends TailwindElement(style) {
  onSlotChange(e: any) {
    const $slot = e.target
    if (!$slot) {
      return
    }
    const childNodes = $slot.assignedNodes({
      flatten: true
    })
    console.log($slot, childNodes, childNodes[0].innerHTML)

    if (!childNodes.length) {
      // $slot.style.display = 'none'
    }
  }
  render() {
    return html`
      <header class="dui-header">
        <div class="dui-container flex grid-cols-3 justify-between items-center">
          <div class="flex items-center gap-3 lg_gap-4 lg_w-40">
            <slot name="logo"><a class="doid-logo" href="https://doid.tech"></a><slot name="sublogo"></slot></slot>
            <slot name="left"></slot>
          </div>
          <div class="flex justify-center items-center">
            <slot name="center"></slot>
          </div>
          <div class="flex justify-end items-center lg_w-40">
            <slot name="right"></slot>
            <slot name="wallet"><connect-wallet-btn></connect-wallet-btn></slot>
          </div>
        </div>
      </header>
    `
  }
}
