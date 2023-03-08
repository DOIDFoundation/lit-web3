import '@lit-web3/core/src/shims/node'
// import '~/lib/webextension-polyfill'
import AppRoot from './AppRoot.wallet'
import { TailwindElement, html, customElement, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { routes } from '~/router'
import emitter from '@lit-web3/core/src/emitter'
import '~/views/home'
import 'stream-browserify'
// Components
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/nav/header'
import '@/components/account/switch'
import { StateController, walletStore } from './store'
import { connectToAccountManager, getConnectStream } from './lib/ui'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  @state() showHeader = false
  state = new StateController(this, walletStore)
  chkView = () => {
    this.showHeader = !['/unlock', '/', '/restore', '/create', '/start'].includes(location.pathname)
    const { style } = document.documentElement
    this.showHeader ? style.removeProperty('--header-height') : style.setProperty('--header-height', `0px`)
  }

  connectedCallback() {
    super.connectedCallback()
    this.chkView()
    const connectionStream = getConnectStream()
    connectToAccountManager(connectionStream, async (err: any, backgroundConnection: any) => {
      console.log(backgroundConnection, 'backgroundConnection')
      await walletStore.setBackgroundConnection(backgroundConnection)
      // walletStore.promisifiedBackground.submitPassword(12345)
    })
    emitter.on('router-change', this.chkView)
    //  const { isUnlocked } = await swGlobal.controller.keyringController.memStore.getState()
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
