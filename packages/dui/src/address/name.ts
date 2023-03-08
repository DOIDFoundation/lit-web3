import { customElement, TailwindElement, html, property, when } from '../shared/TailwindElement'

// Components
import './avatar'

@customElement('dui-name-address')
export class DuiNameAddress extends TailwindElement(null) {
  @property() name = ''
  @property() address = ''
  @property({ type: Boolean }) avatar = false

  get empty() {
    return !this.name || !this.address
  }
  get addr() {
    return this.address ?? ''
  }
  select = () => {
    const data: NameInfo = { name: this.name, account: this.addr }
    this.emit('select', data)
  }
  override render() {
    return html`${when(
      !this.empty,
      () => html`<div class="flex" @click=${this.select}>
        ${when(this.avatar, () => html`<dui-address-avatar class="mr-1.5" .address=${this.addr}></dui-address-avatar>`)}
        ${this.name}
      </div>`
    )}`
  }
}
