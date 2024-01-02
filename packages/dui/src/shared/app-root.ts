import '@lit-web3/base/webcomponent-polyfills'
//
import { ThemeElement, html, customElement } from './theme-element'
import { Router, routerGuard, type RouteConfig, fallbackRender, fallbackEnter } from '@lit-web3/router'
import emitter from '@lit-web3/base/emitter'
import { debounce } from '@lit-web3/ethers/src/utils'

// import '~/variables-override.css' // -> /apps/*/src/variables-override.css
import '../c/g.css'

export default function ({ routes = <RouteConfig[]>[], hashMode = false } = {}) {
  routerGuard.inject()
  // App Root
  @customElement('app-root')
  class AppRoot extends ThemeElement('') {
    _router: any = routerGuard.init(
      new Router(this, routes, {
        hashMode,
        fallback: {
          render: fallbackRender,
          enter: async (params: any) => await fallbackEnter(this._router, params)
        }
      })
    )

    // Trick for @lit-web3/base/state
    forceUpdate = debounce(() => this.requestUpdate(), 100)
    constructor() {
      super()
      emitter.on('force-request-update', () => this.forceUpdate())
    }

    connectedCallback() {
      super.connectedCallback()
    }

    render() {
      return html`<app-main>${this._router.outlet()}</app-main>`
    }
  }
  return AppRoot
}
