import { TailwindElement, html, customElement, state, when, property } from '@lit-web3/dui/src/shared/TailwindElement'
import { goto } from '@lit-web3/dui/src/shared/router'
import { wsSend, uiBlocks, StateController } from '~/store'
import style from './block.css?inline'
@customElement('view-block')
export class ViewHome extends TailwindElement(style) {

  bindBlocks: any = new StateController(this, uiBlocks)
  @property() height = ''
  @property() blocks: any = {}
  @state() pending = false

  goMinerBlock(key: any) {
    if (key == 'miner') {
      goto('/blocks/' + this.blocks[key])
      //
    }
  }
  connectedCallback(): void {
    super.connectedCallback()
    if (this.height) {
      console.log(this.height);
      this.pending = true
      // decodeURIComponent(this.blockObj)
      // this.blocks = JSON.parse(decodeURIComponent(this.blockObj))
      const method = this.height.length == 64 ? 'doid_getBlockByHash' : 'doid_getBlockByHeight'
      wsSend(
        { method: method, params: [this.height.length == 64 ? this.height : +this.height], id: this.height },
        ({ header } = <unknown>{}) => {
          this.pending = false
          this.blocks = header
        })
    }
  }
  render() {
    return html`
      <div class="dui-container">
        <div class="mt-4 px-1">
          <div
            class="text-blue-700 font-bold cursor-pointer uppercase text-sm"
            @click="${() => {
        history.back()
      }}"
          >
            <i class="mdi mdi-arrow-left"></i> Back
          </div>
          <div class="text-3xl mt-1">Block</div>
        </div>
        <div class="bg-gray-100 rounded-lg p-2 px-4 mt-3">
          ${when(this.pending, () => html`
          <div class="text-center p-3 border-t-2">
                <loading-icon type="inline-block"></loading-icon>
              </div>
          `, () => html`
          ${when(this.blocks, () => html`
            ${Object.keys(this.blocks).map(
        (key: string) => html`
                    ${when(
          this.blocks[key],
          () => html`
                        <div class="flex font-blod py-2">
                          <div class="text-gray-400 w-1/4 flex-none capitalize ">${key}:</div>
                          <div
                            class="${when(key === 'miner', () => 'text-blue-500 cursor-pointer underline')}"
                            @click="${() => {
              this.goMinerBlock(key)
            }}"
                          >
                            ${this.blocks[key]}
                          </div>
                        </div>
                      `
        )}
                  `
      )}
            `, () => html`
              <div class="font-bold text-xl text-red-600">Unknown</div>
            `)}
          `)}

        </div>
      </div>
    `
  }
}



