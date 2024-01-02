import { customElement, ThemeElement, html, when, state, property } from '@lit-web3/dui/shared/theme-element'
// Components
import '@lit-web3/dui/button'
import '@lit-web3/dui/dialog'

import style from './index.css?inline'
@customElement('dui-components')
export class DuiComponents extends ThemeElement(style) {
  @property({ type: String }) class = ''
  @state() dialog = false
  open() {
    this.dialog = true
  }
  close() {
    this.dialog = false
  }

  override render() {
    return html`<div class="border m-4 p-4 rounded-md ${this.class}">
      <p class="my-2 font-bold">DUI Buttons</p>
      <!--  -->
      <dui-button>Normal</dui-button>
      <dui-button disabled>Disabled</dui-button>
      <dui-button pending>Pending</dui-button>
      <dui-button icon><i class="mdi mdi-check"></i></dui-button>
      <dui-button class="outlined">Outlined</dui-button>
      <dui-button><i class="mdi mdi-check -ml-1 mr-1"></i>Icon Left</dui-button>
      <dui-button>Icon Right<i class="mdi mdi-check -mr-1 ml-1"></i></dui-button>
      <br />
      <dui-button href="">link href</dui-button><dui-button text>Text</dui-button>
      <br />
      <dui-button sm>Small</dui-button>
      <p class="my-2 font-bold">DUI Dialog</p>
      <dui-button sm @click=${this.open}>Open Dialog</dui-button>
      ${when(this.dialog, () => html`<dui-dialog @close=${this.close}></dui-dialog>`)}
    </div>`
  }
}
