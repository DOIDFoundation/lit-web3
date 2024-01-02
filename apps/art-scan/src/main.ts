import AppRoot from '@lit-web3/dui/shared/app-root.ethers'
import emitter from '@lit-web3/base/emitter'
import { routerPathroot } from '@lit-web3/router'
import { routes } from '~/router'
import { ThemeElement, html, customElement, state, when } from '@lit-web3/dui/shared/theme-element'
// Components
import '~/components/search-bar'
import '@lit-web3/dui/network-warning'
import '@lit-web3/dui/nav/header'
import '@lit-web3/dui/nav/footer'
import '@lit-web3/dui/nav/nav'
import '@lit-web3/dui/link'

@customElement('app-main')
export class AppMain extends ThemeElement('') {
  @state() inRoot = false

  chkView = () => {
    this.inRoot = routerPathroot() === '/'
  }

  connectedCallback() {
    super.connectedCallback()
    this.chkView()
    emitter.on('router-change', this.chkView)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    emitter.off('router-change', this.chkView)
  }

  render() {
    return html`<network-warning></network-warning>
      <dui-header>
        <div slot="logo"><a class="text-base lg_text-lg font-semibold" href="/">ARTSCAN</a></div>
        ${when(
          !this.inRoot,
          () =>
            html`<div slot="wallet" class="w-56 text-xs lg_w-80 lg_sticky top-4 flex-shrink-0">
              <search-bar lite sm></search-bar>
            </div>`
        )}
      </dui-header>
      <main class="dui-app-main pt-6">
        <slot></slot>
      </main>
      <dui-footer>
        <div slot="center" class="text-xs">
          Powered by<dui-link class="ml-0.5 underline underline-offset-2" href="https://doid.tech">DOID</dui-link>
        </div>
        <div slot="right"></div>
      </dui-footer>`
  }
}

AppRoot({ routes })
