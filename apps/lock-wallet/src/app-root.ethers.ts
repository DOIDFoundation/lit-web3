import '@lit-web3/base/webcomponent-polyfills'
//
import { ThemeElement, html, customElement, keyed } from '@lit-web3/dui/shared/theme-element'
import { Router, routerGuard, type RouteConfig, fallbackRender, fallbackEnter } from '@lit-web3/router'
import emitter from '@lit-web3/base/emitter'
import { debounce } from '@lit-web3/ethers/src/utils'

import useBridge, { bridgeStore, StateController } from './ethers/useBridge'

// import '@lit-web3/dui/c/g.css'
import './assets/c/g.css'

useBridge()

export default function ({ routes = <RouteConfig[]>[], hashMode = false } = {}) {
  routerGuard.inject()
  // App Root
  @customElement('app-root')
  class AppRoot extends ThemeElement('') {
    bindBridge: any = new StateController(this, bridgeStore)

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

    render() {
      return html`${keyed(bridgeStore.key, html`<app-main >${this._router.outlet()}</app-main>`)}`
    }
  }
  return AppRoot
}
