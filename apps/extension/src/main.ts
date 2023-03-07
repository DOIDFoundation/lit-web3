import '@lit-web3/core/src/shims/node'
import AppRoot from './AppRoot.wallet'
import { TailwindElement, html, customElement, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { routes } from '~/router'
import emitter from '@lit-web3/core/src/emitter'
import '~/views/home'

// Components
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/nav/header'
import '@/components/account/switch'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  @state() showHeader = false

  chkView = () => {
    this.showHeader = !['/unlock', '/', '/restore', '/create'].includes(location.pathname)
    const { style } = document.documentElement
    this.showHeader ? style.removeProperty('--header-height') : style.setProperty('--header-height', `0px`)
  }

  connectedCallback() {
    super.connectedCallback()
    this.chkView()
    emitter.on('router-change', this.chkView)
  }
  render() {
    return html`${when(
        this.showHeader,
        () =>
          html`<dui-header logoHref="/"
            ><div slot="wallet">
              <account-switch></account-switch>
            </div>
          </dui-header>`
      )}
      <main class="dui-app-main py-6">
        <slot></slot>
      </main>`
  }
}

AppRoot({ routes })
