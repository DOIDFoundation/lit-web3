import { TailwindElement, customElement, html } from './shared/TailwindElement'

import icon from './i/doid.svg'

@customElement('doid-symbol')
export class SharePass extends TailwindElement('') {
  render() {
    return html`<strong class="block w-24 h-24 m-12 mx-auto" href="/"
        ><img class="w-full h-full object-contain select-none pointer-events-none" src="${icon}"
      /></strong>
      <p class="my-8 text-center">
        <strong><slot name="h1"></slot></strong>
      </p>`
  }
}
