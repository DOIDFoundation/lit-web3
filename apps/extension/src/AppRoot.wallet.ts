import AppRoot from '@lit-web3/dui/src/shared/AppRoot'
import useBridge from '@lit-web3/ethers/src/useBridge'
import { JsonRpcProvider as provider } from 'ethers'
import { html, keyed } from '@lit-web3/dui/src/shared/TailwindElement'
import { StateController } from '@lit-app/state'
import { walletStore } from '~/store'
import type { RouteConfig } from '@lit-labs/router'

const isProd = import.meta.env.MODE === 'production'
useBridge({
  chainId: isProd ? '0x1' : import.meta.env.VITE_APP_TESTNET_S ? '0xaa36a7' : '0x5',
  provider,
  persistent: true,
  rpc: isProd
    ? 'https://mainnet.infura.io/v3/50e9845f779f4770a64fa6f47e238d10'
    : import.meta.env.VITE_APP_TESTNET_S
    ? 'https://sepolia.infura.io/v3/50e9845f779f4770a64fa6f47e238d10'
    : 'https://goerli.infura.io/v3/50e9845f779f4770a64fa6f47e238d10'
})

export default function ({ routes = <RouteConfig[]>[] } = {}) {
  class AppRootWallet extends AppRoot({ routes, hashMode: true }) {
    bindBridge: any = new StateController(this, walletStore)
    override render() {
      return html`${keyed(walletStore.key, html`<app-main>${this._router.outlet()}</app-main>`)}`
    }
  }
  return AppRootWallet
}
