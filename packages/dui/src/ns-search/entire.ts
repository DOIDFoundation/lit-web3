import { TailwindElement, html, when, customElement, ref } from '../shared/TailwindElement'
import { property, state } from 'lit/decorators.js'
import { searchStore, StateController } from './store'
import { bridgeStore } from '@lit-web3/ethers/src/useBridge'
import DOIDParser from '@lit-web3/ethers/src/DOIDParser'
import { ValidateDOID } from '../validator/doid'
// Components
import '../input/text'
import '../button'

// Style
import style from './index.css?inline'
@customElement('doid-search-entire')
export class DoidSearchEntire extends ValidateDOID(TailwindElement(style)) {
  bindStore: any = new StateController(this, searchStore)
  bindBridge: any = new StateController(this, bridgeStore)
  @property() placeholder = ''
  @property() default: string | undefined
  @property({ type: Boolean }) entire = false
  @state() keyword = ''
  @state() err = ''
  @state() pending = false

  onInput = async (e?: CustomEvent) => {
    await this.validateDOID(e ?? this.keyword)
    const { error, val, msg = '' } = this.DOID
    this.err = msg
    if (error) return
    if (val) this.keyword = val
  }

  doSearch = async () => {
    await this.onInput()
    if (!this.DOID.error) this.emit('search', this.DOID)
  }

  async connectedCallback() {
    super.connectedCallback()
    if (typeof this.default === 'undefined') return
    const {
      parsed: { error, val = '' }
    } = await DOIDParser(this.default)
    if (!error) this.keyword = val
  }

  render() {
    return html`
      <dui-input-text
        ${ref(this.input$)}
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
              html`<slot name="msg"
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
