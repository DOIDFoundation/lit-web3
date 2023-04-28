import { TailwindElement, classMap, customElement, html, property } from './shared/TailwindElement'

import icon from './i/doid.svg'

@customElement('doid-symbol')
export class DoidSymbol extends TailwindElement('') {
  @property() icon = ''
  @property({ type: Boolean }) sm = false
  @property({ type: Boolean }) dense = false
  render() {
    return html`<strong href="/" class="block m-12 mx-auto ${classMap(this.$c([this.sm ? 'w-14 h-14 ' : 'w-24 h-24']))}"
        ><img class="w-full h-full object-contain select-none pointer-events-none" src="${this.icon || icon}"
      /></strong>
      <div class="my-8 text-center">
        <strong class="block"><slot name="h1"></slot></strong>
        <slot name="msg"></slot>
      </div>`
  }
}

@customElement('doid-icon')
export class DoidIcon extends TailwindElement('') {
  @property({ type: Boolean }) sm = false
  render() {
    return html`<img
      class="w-full h-full object-contain select-none pointer-events-none ${classMap({ 'w-2/3 h-2/3': this.sm })}"
      src="${icon}"
    />`
  }
}
