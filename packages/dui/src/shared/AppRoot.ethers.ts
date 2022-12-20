// Polyfills
import 'urlpattern-polyfill' // Safari 15
import '@webcomponents/webcomponentsjs/webcomponents-loader.js'
import 'lit/polyfill-support.js'
//
import { TailwindElement, html, customElement, keyed } from './TailwindElement'
import { Router, RouteConfig } from '@lit-labs/router'
import { fallbackRender, fallbackEnter } from './router/fallback'
import useBridge, { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import emitter from '@lit-web3/core/src/emitter'

import '@/variables-override.css' // => /apps/*/src/variables-override.css
import '../c/global.css'

useBridge()
// Router
;(function (history) {
  var pushState = history.pushState
  history.pushState = function (state, key, href) {
    // self logic
    setTimeout(() => {
      emitter.emit('router-change', href ?? '')
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)
    }, 0)
    // // that.pathname = getPathName(path ?? '')
    // if (typeof history.onpushstate == 'function') {
    //   history.onpushstate({ state: state, key, path })
    // }
    // ... whatever else you want to do
    // maybe call onhashchange e.handler
    return pushState.apply(history, [state, key, href])
  }
})(window.history)

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
      // Trick for @lit-labs/router
      emitter.on('router-goto', (e: any) => {
        history.pushState({}, '', e.detail)
        this._router.goto(e.detail)
      })
      emitter.on('router-replace', (e: any) => {
        history.replaceState({}, '', e.detail)
        this._router.goto(e.detail)
      })
    }

    firstUpdated() {}
    render() {
      return html`${keyed(bridgeStore.key, html`<app-main>${this._router.outlet()}</app-main>`)}`
    }
  }
  return AppRoot
}
