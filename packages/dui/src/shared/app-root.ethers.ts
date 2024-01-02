import AppRoot from './app-root'
import useBridge, { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'
import { html, keyed } from './theme-element'
import type { RouteConfig } from '@lit-web3/router'

useBridge()

export default function ({ routes = <RouteConfig[]>[] } = {}) {
  class AppRootEthers extends AppRoot({ routes }) {
    bindBridge: any = new StateController(this, bridgeStore)
    override render() {
      return html`${keyed(bridgeStore.key, html`<app-main>${this._router.outlet()}</app-main>`)}`
    }
  }
  return AppRootEthers
}
