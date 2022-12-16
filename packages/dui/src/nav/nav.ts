import { TailwindElement, html, customElement } from '../shared/TailwindElement'

@customElement('dui-nav')
export class DuiNav extends TailwindElement('') {
  render() {
    return html`
      <nav class="flex gap-3 lg_gap-6 justify-center items-center">
        <slot></slot>
      </nav>
    `
  }
}
