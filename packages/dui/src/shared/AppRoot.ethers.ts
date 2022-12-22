// Polyfills
import 'urlpattern-polyfill' // Safari 15
import '@webcomponents/webcomponentsjs/webcomponents-loader.js'
import 'lit/polyfill-support.js'
//
import { TailwindElement, html, customElement, keyed } from './TailwindElement'
import { Router, RouteConfig } from '@lit-labs/router'
import { fallbackRender, fallbackEnter } from './router/fallback'
import { routerGuard } from './router'
import useBridge, { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import emitter from '@lit-web3/core/src/emitter'

import '@/variables-override.css' // => /apps/*/src/variables-override.css
import '../c/global.css'

useBridge()
routerGuard.inject()

export default function ({ routes = <RouteConfig[]>[] } = {}) {
  // App Root
  @customElement('app-root')
  class AppRoot extends TailwindElement('') {
    bindBridge: any = new StateController(this, bridgeStore)
    private _router: Router = new Router(this, routes, {
      fallback: {
        render: fallbackRender,
        enter: async (params) => await fallbackEnter(this._router, params)
      }
    })

    constructor() {
      super()
      // Trick for @lit-app/state
      emitter.on('force-request-update', async () => {
        await 0
        this.requestUpdate()
      })
    }

    connectedCallback(): void {
      super.connectedCallback()
      routerGuard.init(this._router)
    }

    render() {
      return html`${keyed(bridgeStore.key, html`<app-main>${this._router.outlet()}</app-main>`)}`
    }
  }
  return AppRoot
}
