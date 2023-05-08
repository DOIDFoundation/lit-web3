// import '@lit-web3/core/src/shims/node'
import AppRoot from './AppRoot.wallet'
import { TailwindElement, html, customElement, state, when } from '@lit-web3/dui/src/shared/TailwindElement'
import { routes } from '~/router'
import emitter from '@lit-web3/core/src/emitter'
import { routerPathname } from '@lit-web3/dui/src/shared/router'
import '~/views/home'
// Components
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/link'
import '@lit-web3/dui/src/nav/header'
import '~/components/account/switch'
// import { StateController, walletStore } from './store'

@customElement('app-main')
export class AppMain extends TailwindElement('') {
  // state = new StateController(this, walletStore)
  @state() showHeader = false
  chkView = () => {
    const pathname = routerPathname()
    this.showHeader =
      !['/', '/popup.html', '/recover', '/restore', '/start', '/import', '/import2nd', '/import3rd'].includes(
        pathname
      ) && !['/unlock', '/landing', '/create', '/generate-phrase'].some((substr) => pathname.startsWith(substr))
    const { style } = document.documentElement
    this.showHeader ? style.removeProperty('--header-height') : style.setProperty('--header-height', `0px`)
  }

  async connectedCallback() {
    super.connectedCallback()
    this.chkView()
    emitter.on('router-change', this.chkView)
    // const connectionStream = await getConnectStream()
    // connectToAccountManager(connectionStream, async (err: any, backgroundConnection: any) => {
    //   // console.log(backgroundConnection, 'backgroundConnection')
    //   await backgroundConnection.getState(async (err: any, state: any) => {
    //     if (err) return
    //     console.log(state, 'state----')
    //     walletStore.setState(state)
    //     await walletStore.setBackgroundConnection(backgroundConnection)
    //     // if (!walletStore.doidState.seedPhraseBackedUp && !walletStore.doidState.isInitialized) {
    //     //   goto('/generate-phrase')
    //     //   return
    //     // }
    //     // if (walletStore.doidState.isInitialized && !walletStore.doidState.seedPhraseBackedUp) {
    //     //   goto('/generate-phrase/unlock')
    //     //   return
    //     // }
    //     // if (!walletStore.doidState.isUnlocked) {
    //     //   goto('/unlock')
    //     //   return
    //     // }
    //   })
    // })
  }
  render() {
    return html`${when(
        this.showHeader,
        () =>
          html`<dui-header fixed logoHref="/">
            <div slot="left"><account-switch></account-switch></div>
            <div slot="right" class="block w-6 h-6 mx-auto">
              <dui-link href="/"><doid-icon></doid-icon></dui-link>
            </div>
            <div slot="logo"></div>
            <div slot="wallet"></div>
          </dui-header>`
      )}
      <main class="dui-app-main pt-4 pb-8">
        <slot></slot>
      </main>`
  }
}

AppRoot({ routes })
