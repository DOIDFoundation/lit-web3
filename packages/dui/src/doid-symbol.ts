import { TailwindElement, customElement, html, property } from './shared/TailwindElement'

import icon from './i/doid.svg'

@customElement('doid-symbol')
export class SharePass extends TailwindElement('') {
  @property() icon = ''
  render() {
    return html`<strong class="block w-24 h-24 m-12 mx-auto" href="/"
        ><img class="w-full h-full object-contain select-none pointer-events-none" src="${this.icon || icon}"
      /></strong>
      <div class="my-8 text-center">
        <strong class="block"><slot name="h1"></slot></strong>
        <slot name="msg"></slot>
      </div>`
  }
}
