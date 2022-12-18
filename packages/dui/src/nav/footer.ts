import { TailwindElement, html, customElement } from '../shared/TailwindElement'
// Components
import '../block-number'
import '../link'

import style from './footer.css'

@customElement('dui-footer')
export class DuiFooter extends TailwindElement(style) {
  render() {
    return html`
      <footer class="dui-footer">
        <div class="dui-container grid grid-cols-3 justify-between items-center gap-4">
          <div class="opacity-80">
            <slot name="left"><block-number></block-number></slot>
          </div>
          <div class="flex justify-center items-center text-center">
            <slot name="center"><dui-link href="https://doid.tech">doid.tech</dui-link></slot>
          </div>

          <div class="flex justify-end items-center">
            <slot name="right"><span class="opacity-50">${import.meta.env.VITE_APP_VER}</span></slot>
          </div>
        </div>
      </footer>
    `
  }
}
