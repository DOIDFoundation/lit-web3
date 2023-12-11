import { customElement, TailwindElement, html, state, when, classMap } from '@lit-web3/dui/src/shared/TailwindElement'
import { uiKeyring, StateController } from '~/store/keyringState'
import '@lit-web3/dui/src/menu/drop'
import popupMessenger from '~/lib.next/messenger/popup'
import { goto } from '@lit-web3/dui/src/shared/router'
// Styles
import style from './btn.css?inline'

@customElement('settings-btn')
export class SettingsBtn extends TailwindElement(style) {
  bindKeyring: any = new StateController(this, uiKeyring)

  @state() menu = false

  go2(uri: string) {
    if (/^http/.test(uri)) window.open(uri, '_blank', 'noopener')
    else goto(uri)
    this.menu = false
  }
  lock = async () => {
    await popupMessenger.send('lock')
  }

  render() {
    return html`<div class="relative">
      <dui-drop md btnIcon .show=${this.menu} @change=${(e: CustomEvent) => (this.menu = e.detail)}>
        <i slot="button" class="text-xl mdi mdi-dots-vertical"></i>
        <!-- Content -->
        <ul>
          <li @click=${() => this.go2('https://doid.tech')}><i class="mdi mdi-information"></i>About</li>
          <li @click=${() => this.go2('https://discord.gg/N9emnzwAzm')}>
            <i class="mdi mdi-comment-question"></i>Support
          </li>
          <li @click=${() => this.go2('/settings')}><i class="mdi mdi-cog"></i>Settings</li>
          <li @click=${this.lock}><i class="mdi mdi-lock"></i>Lock DOID</li>
        </ul>
      </dui-drop>
    </div>`
  }
}
