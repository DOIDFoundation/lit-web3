import { TailwindElement, html, customElement, when, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { uiNetworks, StateController } from '~/store/networkState'
import { getNetwork } from '@lit-web3/chain/src'
import popupMessenger from '~/lib.next/messenger/popup'
// Components
import '@lit-web3/dui/src/button'
import '@lit-web3/dui/src/chain/symbol'
import '~/components/connect/hostInfo'

@customElement('view-switch-network')
export class ViewSwitchNetwork extends TailwindElement(null) {
  bindNetworks = new StateController(this, uiNetworks)

  @property() chainNetwork!: ChainNetwork

  @state() destChainNetwork: ChainNetwork | null = null

  get preferNetwork() {
    return uiNetworks.get(this.chainNetwork.name)
  }
  get disabled() {
    return !this.destChainNetwork || uiNetworks.pending
  }

  async connectedCallback() {
    super.connectedCallback()
    const { name, id } = this.chainNetwork
    this.destChainNetwork = getNetwork(name, id)
  }

  close() {
    popupMessenger.send('reply_switch_network', false)
    // window.close()
  }
  switch = async () => {
    if (!this.destChainNetwork) return
    await uiNetworks.switchNetwork(this.destChainNetwork.name, this.destChainNetwork.id)
    popupMessenger.send('reply_switch_network', 'ok')
    // window.close()
  }

  render() {
    return html`<div class="view-notification">
      <div class="text-center px-8">
        <div class="border rounded-full p-2 px-4 inline-flex">
          <connect-host-info></connect-host-info>
        </div>
        <div class="text-xl font-bold mt-2">Allow this site to switch the network?</div>
        <div class="my-2">This will switch the selected network within DOID to an enabled network:</div>
        <p class="font-bold mt-4 mb-2">Current:</p>
        <div class="border rounded-full border-blue-600 p-2 px-4 inline-flex">
          <chain-symbol .chain=${this.preferNetwork} text></chain-symbol>
        </div>
        <p class="my-4"><i class="text-xl mdi mdi-arrow-down"></i></p>
        <p class="font-bold mt-4 mb-2">Destination:</p>
        <div class="border border-dashed rounded-full border-blue-600 p-2 px-4 inline-flex">
          <chain-symbol .chain=${this.destChainNetwork} text></chain-symbol>
        </div>
      </div>
      <!-- Buttons -->
      <div class="grid grid-cols-2 gap-3 px-4 fixed bottom-0 w-full pb-4 pt-2 bg-white">
        <dui-button @click=${this.close} class="block w-full secondary outlined !rounded-full h-12" block
          >Cancel</dui-button
        >
        <dui-button
          @click=${this.switch}
          class="block w-full secondary !rounded-full h-12"
          block
          ?disabled=${this.disabled}
          >Switch Network</dui-button
        >
      </div>
    </div>`
  }
}
