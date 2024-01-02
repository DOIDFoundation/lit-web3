import { ThemeElement, html, customElement } from '@lit-web3/dui/shared/theme-element'

@customElement('view-faq')
export class ViewFaq extends ThemeElement('') {
  render() {
    return html`<div class="view-faq">
      <div class="dui-container px-3">
        <p class="my-8 text-center">FAQ</p>
      </div>
    </div>`
  }
}
