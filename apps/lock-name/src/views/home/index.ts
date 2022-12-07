import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'

// Components

// Style
import style from './index.css'

@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  render() {
    return html`<div class="home">
      <div class="dui-container"></div>
    </div>`
  }
}
