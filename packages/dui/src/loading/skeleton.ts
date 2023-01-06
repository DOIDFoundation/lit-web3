import { TailwindElement, customElement, html, property, when, repeat } from '../shared/TailwindElement'
// Styles
import style from './skeleton.css?inline'

@customElement('loading-skeleton')
export class LoadingSkeleton extends TailwindElement(style) {
  @property({ type: Boolean }) expect = false
  @property({ type: Number }) num = 1
  get groups() {
    return new Array(this.num)
  }

  render() {
    if (this.expect) return html`<slot></slot>`
    return html`<div class="skeleton">${repeat(this.groups, () => html`<div class="p"></div>`)}</div>`
  }
}
