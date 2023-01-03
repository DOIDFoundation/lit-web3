import { TailwindElement, html, when, customElement, ref, createRef } from '../shared/TailwindElement'
import { property, state } from 'lit/decorators.js'
import { searchStore, StateController } from './store'
import { bridgeStore } from '@lit-web3/ethers/src/useBridge'
import emitter from '@lit-web3/core/src/emitter'
import { wrapTLD, checkDOIDName } from '@lit-web3/ethers/src/nsResolver/checker'
import { validateDOIDName } from '../validator/doid-name'
// Components
import '../input/text'
import '../button'

// Style
import style from './index.css?inline'
@customElement('dui-ns-search')
export class duiNsSearch extends TailwindElement(style) {
  validateDOIDName: any
  _checked: CheckedName = {}
  inputNameRef: any = createRef()
  constructor() {
    super()
    validateDOIDName.bind(this, { allowAddress: true })()
  }
  bindStore: any = new StateController(this, searchStore)
  bindBridge: any = new StateController(this, bridgeStore)
  @property() placeholder = ''
  @property() min = 2
  @property() text: string | undefined
  @state() keyword = ''
  @state() err = ''
  @state() pending = false

  onInput = async (e: CustomEvent) => {
    const { val, error, msg } = await this.validateDOIDName(e)
    this.err = msg
    if (error) return
    this.keyword = val
  }

  doSearch() {
    if (!bridgeStore.bridge.account) return emitter.emit('connect-wallet')
    if (this.err) return
    if (this._checked.name) this.keyword = wrapTLD(this.keyword)
    this.emit('search', this.keyword)
  }

  async connectedCallback() {
    super.connectedCallback()
    const { name = '', address = '' } = await checkDOIDName(this.text, { wrap: true })
    this.keyword = name || address
  }

  render() {
    return html`
      <dui-input-text
        class="scan-search"
        ${ref(this.inputNameRef)}
        @input=${this.onInput}
        @submit=${this.doSearch}
        value=${this.keyword}
        placeholder=${this.placeholder}
        ?disabled=${this.pending}
      >
        <span slot="label"><slot name="label"></slot></span>
        <span slot="right" class="-mr-1">
          <dui-button @click=${this.doSearch} icon sm class="text-blue-500"
            ><i class="mdi mdi-magnify text-lg"></i
          ></dui-button>
        </span>
        <span slot="msg">
          ${when(
            this.err,
            () => html`<span class="text-red-500">${this.err}</span>`,
            () =>
              html`<slot name="msgd"
                ><span class="text-gray-400"
                  >e.g. sabet.doid, sabet.doid/galaxy-sailor-in-motion-2021-sabet#293032</span
                ></slot
              >`
          )}
        </span>
      </dui-input-text>
    `
  }
}
