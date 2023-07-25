import { TailwindElement, html, customElement } from '@lit-web3/dui/src/shared/TailwindElement'

@customElement('view-faq')
export class ViewFaq extends TailwindElement('') {
  render() {
    return html`<div class="view-faq">
      <div class="dui-container px-3">
        <p class="my-8 text-center">FAQ</p>
      </div>
    </div>`
  }
}
