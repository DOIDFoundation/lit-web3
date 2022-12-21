import { customElement, TailwindElement, html, state } from '../shared/TailwindElement'
import { sleep } from '@lit-web3/ethers/src/utils'
import { animate } from '@lit-labs/motion'

import style from './dialog.css?inline'

@customElement('dui-prompt')
export class DuiPrompt extends TailwindElement(style) {
  @state() model = false

  async close() {
    this.model = false
    await sleep(200)
    this.remove()
    this.emit('close')
  }

  override render() {
    setTimeout(() => {
      this.model = true
    })
    return html`
      <div
        part="dialog-container"
        class="relative !origin-center z-10 bg-white rounded-xl drop-shadow-lg ${this.model
          ? '-mt-8 opacity-100 visible'
          : '-mt-80 opacity-0 invisible'}"
        ${animate({
          guard: () => this.model,
          properties: ['opacity', 'visibility', 'margin', 'transform'],
          keyframeOptions: { duration: 233 }
        })}
      >
        <slot name="top">
          <i
            part="dialog-close"
            class="absolute flex justify-center items-center right-4 top-4 w-6 h-6 text-2xl cursor-pointer"
            @click="${this.close}"
          >
            <i class="mdi mdi-close"></i>
          </i>
          <div part="dialog-header" class="w-full p-4 pr-8 flex justify-between items-center text-base">
            <slot name="header"></slot></div
        ></slot>
        <slot name="center">
          <div part="dialog-body" class="p-4"><slot></slot></div>
        </slot>
        <slot name="bottom">
          <div part="dialog-footer" class="p-4"><slot name="footer"></slot></div>
        </slot>
      </div>
      <div
        part="dialog-overlay"
        class="z-0 absolute left-0 top-0 w-full h-full visible bg-black bg-opacity-75 ${this.model
          ? 'opacity-75'
          : 'opacity-0'}"
        ${animate({ guard: () => this.model })}
      ></div>
    `
  }
}
