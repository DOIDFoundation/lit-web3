import { TailwindElement, html, customElement, property, state, classMap } from '../shared/TailwindElement'

import clipboard from './clipboard'

import style from './index.css'

@customElement('dui-copy')
export class DuiCopy extends TailwindElement(style) {
  @property() value = ''

  @state() copied = false
  firstUpdated() {}
  async doCopy() {
    const text = this.value
    if (!text) return
    this.copied = false
    try {
      await clipboard.writeText(text as any)
      this.copied = true
    } catch (err) {
      this.copied = false
    }
  }
  get icon() {
    return this.copied ? 'mdi-check' : 'mdi-content-copy'
  }
  render() {
    return html`
      <dui-button sm @click="${this.doCopy}" class="outlined ${classMap({ copied: this.copied })}"
        >${this.copied ? html`Copied` : html`Copy`}
        <i part="copy-icon" class="mdi ${this.icon}"></i>
      </dui-button>
    `
  }
}
