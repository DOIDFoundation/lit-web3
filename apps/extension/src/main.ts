import '@lit-web3/core/src/shims/node'
// import '~/lib/webextension-polyfill'
import AppRoot from './AppRoot.wallet'
import { TailwindElement, html, customElement, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { routes } from '~/router'
import emitter from '@lit-web3/core/src/emitter'
import '~/views/home'
// Components
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/nav/header'
import '~/components/account/switch'
import { StateController, walletStore } from './store'
import { connectToAccountManager, getConnectStream } from './lib/ui'
import { goto } from '@lit-web3/dui/src/shared/router'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  @state() showHeader = false
  state = new StateController(this, walletStore)
  chkView = () => {
    this.showHeader = !['/unlock', '/', '/landing', '/restore', '/create', '/start', '/recover'].includes(
      location.pathname
    )
    const { style } = document.documentElement
    this.showHeader ? style.removeProperty('--header-height') : style.setProperty('--header-height', `0px`)
  }

  connectedCallback() {
    super.connectedCallback()
    this.chkView()
    emitter.on('router-change', this.chkView)
    const connectionStream = getConnectStream()
    connectToAccountManager(connectionStream, async (err: any, backgroundConnection: any) => {
      // console.log(backgroundConnection, 'backgroundConnection')
      await backgroundConnection.getState(async (err: any, state: any) => {
        if (err) return
        console.log(state, 'state----')
        walletStore.setState(state)
        await walletStore.setBackgroundConnection(backgroundConnection)
        if (!walletStore.doidState.seedPhraseBackedUp && !walletStore.doidState.isInitialized) {
          goto('/generate-phrase')
          return
        }
        if (walletStore.doidState.isInitialized && !walletStore.doidState.seedPhraseBackedUp) {
          goto('/generate-phrase/unlock')
          return
        }
        if (!walletStore.doidState.isUnlocked) {
          goto('/unlock')
          return
        }
      })
    })
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
