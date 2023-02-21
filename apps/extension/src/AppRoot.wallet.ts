import AppRoot from '@lit-web3/dui/src/shared/AppRoot'
import { html, keyed } from '@lit-web3/dui/src/shared/TailwindElement'
import { StateController } from '@lit-app/state'
import { walletStore } from '~/store'
import { RouteConfig } from '@lit-labs/router'

export default function ({ routes = <RouteConfig[]>[] } = {}) {
  class AppRootWallet extends AppRoot({ routes }) {
    bindBridge: any = new StateController(this, walletStore)
    override render() {
      return html`${keyed(walletStore.key, html`<app-main>${this._router.outlet()}</app-main>`)}`
    }
  }
  return AppRootWallet
}
