import AppRoot from './app-root.ethers'
import { ThemeElement, html, customElement, when, state } from '@lit-web3/dui/shared/theme-element'
import { routes } from '~/router'
import { bridgeStore, StateController } from './ethers/useBridge'
// Components

import '~/components/send/index'
import '~/components/w-header/index'

@customElement('app-main')
export class AppMain extends ThemeElement('') {
  bindBridge: any = new StateController(this, bridgeStore)

  get account() {
    // return bridgeStore.bridge.account
    return ''
  }
  // async connectEthers() {
  //   let signer = await this.doidConnectorEthers.getSigner()
  //   this.accountEthers = signer.address
  // }

  render() {
    return html`
    <div class="max-w-xl min-h-96 bg-white rounded-2xl mx-auto mt-10 p-6">
      <w-header></w-header>
      <main>
        <slot></slot>
      </main>
    </div>
    `
  }
}

AppRoot({ routes })
