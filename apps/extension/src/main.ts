import AppRoot from './app-root.wallet'
import { ThemeElement, html, customElement, state, when } from '@lit-web3/dui/shared/theme-element'
import { routes } from '~/router'
import emitter from '@lit-web3/base/emitter'
import { routerPathname } from '@lit-web3/router'
import '~/views/home'
// Components
import '@lit-web3/dui/doid-symbol'
import '@lit-web3/dui/link'
import '@lit-web3/dui/nav/header'
import '~/components/account/switch'
import '~/components/account/connection'
import '~/components/connect/guard'
import '~/components/settings/btn'
// import { StateController, walletStore } from './store'

@customElement('app-main')
export class AppMain extends ThemeElement('') {
  // state = new StateController(this, walletStore)
  @state() showHeader = false
  chkView = () => {
    const pathname = routerPathname()
    this.showHeader =
      !['/', '/popup.html', '/recover', '/restore', '/start', '/import', '/import2nd', '/import3rd', '/idle'].includes(
        pathname
      ) &&
      !['/unlock', '/landing', '/create', '/generate-phrase', '/connect', '/switchNetwork'].some((substr) =>
        pathname.startsWith(substr)
      )
    const { style } = document.documentElement
    this.showHeader ? style.removeProperty('--header-height') : style.setProperty('--header-height', `0px`)
  }

  async connectedCallback() {
    super.connectedCallback()
    this.chkView()
    emitter.on('router-change', this.chkView)
  }
  render() {
    return html`${when(
        this.showHeader,
        () =>
          html`<dui-header fixed logoHref="/">
            <div slot="left" class="flex items-center gap-4">
              <account-switch></account-switch>
              <account-connection></account-connection>
            </div>
            <div slot="right" class="flex items-center gap-4">
              <settings-btn></settings-btn>
            </div>
            <div slot="logo"></div>
            <div slot="wallet"></div>
          </dui-header>`
      )}
      <main class="dui-app-main pt-4 pb-8">
        <slot></slot>
      </main>
      <!-- Global cmps -->
      <connects-guard></connects-guard>`
  }
}

AppRoot({ routes })
