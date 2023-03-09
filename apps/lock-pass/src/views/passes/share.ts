import { TailwindElement, html } from '@lit-web3/dui/src/shared/TailwindElement'
import { customElement, property, state } from 'lit/decorators.js'

import { getInviteCode, getInviteLimits } from '~/lib/locker'

import { bridgeStore, StateController } from '@lit-web3/ethers/src/useBridge'

import '@lit-web3/dui/src/copy'

import style from './share.css?inline'
@customElement('pass-share')
export class SharePass extends TailwindElement(style) {
  bindBridge: any = new StateController(this, bridgeStore)
  @property() name = ''
  @state() limit = '0'
  @state() inviteCode = ''

  get bridge() {
    return bridgeStore.bridge
  }

  get inviteLink() {
    return `https://lockpass.doid.tech/?ic=${this.inviteCode}`
  }

  async connectedCallback() {
    super.connectedCallback()
    this.limit = await getInviteLimits()
  }

  genInviteCode = async () => {
    try {
      let res = await getInviteCode()
      if (res) this.inviteCode = res
    } catch (e: any) {
      // console.error(e)
    }
  }
  get shareText() {
    const tip =
      'DOID lock name event is live. Mint your lock pass NFT for free and reserve your desired name now. Get invitation here: '
    return `${tip}${this.inviteLink}`
  }

  render() {
    return html`<p class="text-sm text-gray-500">
        You have <b>${this.limit}</b> invitations in total. Copy the invitation code or share the link.
      </p>
      <div class="py-2">
        ${this.inviteCode
          ? html`
              <textarea
                class="block w-full h-24 my-3 border border-solid border-gray-200 py-2 px-2 text-gray-400"
                readonly
              >
${this.shareText}</textarea
              >
              <dui-copy value="${this.shareText}" sm class="outlined">
                <span slot="copied">Copy<i class="ml-1 mdi mdi-check text-green-600"></i></span
                ><span slot="copy">Copy<i class="ml-1 mdi mdi-content-copy"></i></span
              ></dui-copy>
            `
          : +this.limit > 0
          ? html`<dui-button sm @click="${this.genInviteCode}">Share</dui-button>`
          : html``}
      </div>`
  }
}
