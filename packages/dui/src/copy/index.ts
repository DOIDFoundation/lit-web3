import { TailwindElement, html, customElement, property, state, classMap } from '../shared/TailwindElement'

import clipboard from './clipboard'

import style from './index.css?inline'

@customElement('dui-copy')
export class DuiCopy extends TailwindElement(style) {
  @property() value = ''
  @property({ type: String }) class = ''
  @property({ type: Boolean }) icon = false
  @property({ type: Boolean }) sm = false
  @property({ type: Number }) interval = 2.5

  @state() copied = false
  @state() copiedShow = false
  timer: any = null

  async doCopy(e: Event) {
    e.preventDefault()
    e.stopImmediatePropagation()
    clearTimeout(this.timer)
    const text = this.value
    if (!text) return
    this.copied = false
    try {
      let _this = this
      await clipboard.writeText(text as any)
      this.copied = true
      this.copiedShow = true
      this.timer = setTimeout(() => {
        _this.copiedShow = false
      }, this.interval * 1000)
    } catch (err) {
      this.copied = false
    }
  }
  render() {
    return html`
      <dui-button
        ?icon=${this.icon}
        ?sm=${this.sm}
        @click=${this.doCopy}
        class="${(classMap({ copied: this.copiedShow }), this.class)}"
      >
        ${this.copied && this.copiedShow
          ? html`<slot name="copied">Copied</slot>`
          : html`<slot name="copy">Copy</slot>`}
      </dui-button>
    `
  }
}
