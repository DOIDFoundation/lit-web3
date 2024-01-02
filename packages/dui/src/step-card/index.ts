import { ThemeElement, html, customElement, property, classMap } from '../shared/theme-element'

// Component
// Styles
import style from './index.css?inline'
@customElement('dui-card')
export class DuiCard extends ThemeElement(style) {
  @property({ type: String }) class = ''
  @property({ type: String }) index = 1

  connectedCallback() {
    super.connectedCallback()
  }
  disconnectedCallback() {
    super.disconnectedCallback()
  }
  render() {
    return html`
      <div class="card h-full ${classMap(this.$c([this.class]))}" idx=${this.index}>
        <slot name="title" part="step-title"></slot>
        <slot name="description" part="step-desc"></slot>
      </div>
    `
  }
}
