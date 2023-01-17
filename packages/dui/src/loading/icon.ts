import { TailwindElement, customElement, html, property } from '../shared/TailwindElement'

@customElement('loading-icon')
export class LoadingIcon extends TailwindElement('') {
  @property({ type: String }) type = 'inline'

  render() {
    switch (this.type) {
      case 'block':
        return html`<div class="block mx-auto my-8 text-center text-xl"><i class="mdi mdi-loading mx-1"></i></div>`
      default:
        return html`<i class="mdi mdi-loading mr-1"></i> Loading...`
    }
  }
}
