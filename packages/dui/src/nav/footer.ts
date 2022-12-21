import { TailwindElement, html, customElement } from '../shared/TailwindElement'
// Components
import '../block-number'
import '../link'

import style from './footer.css?inline'
@customElement('dui-footer')
export class DuiFooter extends TailwindElement(style) {
  render() {
    return html`
      <footer class="dui-footer">
        <div class="dui-container flex justify-between items-center gap-4">
          <div class="flex gap-3 items-center opacity-80 lg_w-40">
            <slot name="block"><block-number></block-number></slot>
            <slot name="left"></slot>
          </div>
          <div class="flex justify-center items-center text-center">
            <slot name="center"><dui-link href="https://doid.tech">doid.tech</dui-link></slot>
          </div>
          <div class="flex gap-3 justify-end items-center lg_w-40">
            <slot name="right"></slot>
            <slot name="ver"><span class="opacity-50">${import.meta.env.VITE_APP_VER}</span></slot>
          </div>
        </div>
      </footer>
    `
  }
}
