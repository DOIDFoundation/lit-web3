import { TailwindElement, html, customElement, property, state } from '@lit-web3/dui/src/shared/TailwindElement'
import { nameInfo } from '@lit-web3/ethers/src/nsResolver'

// Components
import '@lit-web3/dui/src/address'
// Styles
import style from './info.css?inline'

@customElement('artist-info')
export class ArtistInfo extends TailwindElement(style) {
  @property() name = ''

  @state() info?: NameInfo

  getOwnerInfo = async () => {
    this.info = (await nameInfo(this.name)) as NameInfo
  }
  connectedCallback() {
    super.connectedCallback()
    this.getOwnerInfo()
  }

  render() {
    return html`<div class="artist-info">
      <div class="text-base mb-2">${this.name}</div>
      <div class="flex gap-2">
        <div><dui-address .address=${this.info?.owner} avatar short copy></dui-address></div>
      </div>
    </div>`
  }
}
