import { customElement, ThemeElement, html, state, repeat, when, classMap } from '@lit-web3/dui/shared/theme-element'
import icon from '~/assets/i/symbol/doid-logo.svg'
import '~/components/connect-btn/btn'
import '~/components/switch-network/index'
import style from './index.css?inline'
@customElement('w-header')
export class WHeader extends ThemeElement(style) {

  render() {
    return html`
    <div class="flex justify-between">
      <a href="/">
        <img src="${icon}" class="w-20"/>
      </a>
      <div class="flex items-center">
        <switch-network></switch-network>
        <connect-btn></connect-btn>
      </div>
    </div>
    `
  }
}
