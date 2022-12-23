import { TailwindElement, html, customElement, classMap, property } from '../shared/TailwindElement'
import { screenStore, StateController } from '@lit-web3/core/src/screen'

import style from './nav.css?inline'
@customElement('dui-nav')
export class DuiNav extends TailwindElement(style) {
  bindScreen: any = new StateController(this, screenStore)
  @property({ type: Boolean }) menuable = false
  get asMenu() {
    return this.menuable && screenStore.isMobi
  }

  render() {
    return html`
      <nav class="flex gap-3 lg_gap-6 justify-center items-center ${classMap({ 'flex-col': this.asMenu })}">
        <slot></slot>
      </nav>
    `
  }
}
