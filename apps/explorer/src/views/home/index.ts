import {
  TailwindElement,
  html,
  customElement,
  state,
  when,
  property,
  repeat,
  classMap,
  keyed
} from '@lit-web3/dui/src/shared/TailwindElement'
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/loading/icon'
import '../../components/search/index'
import { goto } from '@lit-web3/dui/src/shared/router'
import { wsSend, uiBlocks, StateController } from '~/store'
// import http from '@lit-web3/core/src/http'
// import { defaultNetwork } from '@lit-web3/doids/src/networks'
// import jsonRpcRequest from '@lit-web3/core/src/http/jsonRpcRequest'
import '@lit-web3/dui/src/button'

import style from './home.css?inline'
@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  bindBlocks: any = new StateController(this, uiBlocks)
  @property() miner = ''
  @state() minerData = { data: [], totalPage: 0, page: 1, limit: 10, ts: 0 }
  @state() minerBlocks: Block[] = []
  @state() pending = false

  get loading() {
    return this.miner ? !this.minerData.ts : uiBlocks.loading
  }

  goto = (block: any) => {
    // const _block = JSON.stringify(block)
    goto(`/block/${block.height}`)
  }

  search(e: any) {
    const keyType = e.detail.toString().length == 64 ? 'tx' : 'block'
    if (keyType == 'tx') {
      goto(`/tx/${e.detail}`)
    } else {
      goto(`/block/${e.detail}`)
    }
  }

  // TODO: merge to UIBlocks
  getMinerBlocks = (page = 1) => {
    if (!this.miner) return
    this.pending = true
    if (page < 1) page = 1
    if (this.minerData.totalPage != 0 && page >= this.minerData.totalPage) page = this.minerData.totalPage
    this.minerData.page = page
    this.minerBlocks = []
    this.minerData.ts = 0
    wsSend(
      {
        method: 'doid_getBlockByMiner',
        params: [{ miner: this.miner.toLowerCase(), limit: this.minerData.limit, page: this.minerData.page }]
      },
      ({ data, totalPage } = <unknown>{}) => {
        this.minerData.data = data
        this.minerData.totalPage = totalPage
        for (let index in this.minerData.data) {
          wsSend(
            { method: 'doid_getBlockByHeight', params: [this.minerData.data[index]] },
            ({ header } = <unknown>{}) => {
              if (page !== this.minerData.page) return
              this.minerBlocks = [header, ...this.minerBlocks].sort((a, b) => a.height - b.height)
              this.pending = false
              this.minerData.ts++
            }
          )
        }
        this.minerBlocks.length = Math.min(this.minerBlocks.length, this.minerData.limit)
      }
    )
  }

  connectedCallback(): void {
    super.connectedCallback()
    // Init
    this.getMinerBlocks()
  }
  render() {
    return html`<div class="home">
      <div class="dui-container">
        <div class="mx-auto">
          ${when(this.miner, () => null, () => html`
          <div class="max-w-full mx-auto">
            <dui-block-search @search=${this.search} placeholder="Search Txn Hash / Block Height"></dui-block-search>
          </div>
          `)}

        </div>
        <div class="mt-4 flex justify-between items-center px-1">
          <div class="text-3xl">
            ${when(
      !this.miner,
      () => 'Latest Blocks',
      () => html`
                <div class="text-blue-700 font-bold cursor-pointer uppercase text-sm" @click="${() => goto('/')}">
                  <i class="mdi mdi-arrow-left"></i> Back
                </div>
                <div class="mt-1">Blocks</div>
              `
    )}
          </div>

          <div>
            ${when(
      !this.miner,
      () => html`
                ${when(
        uiBlocks.isConnected,
        () => html`<div class="inline-flex gap-2 items-center text-green-600">
                    <span class="relative inline-flex h-3 w-3">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"
                      ></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-green-700"></span>
                    </span>
                    Connected
                  </div>`,
        () => html`
                    <div class="text-gray-600 inline-block">
                      <i class="mdi mdi-lan-disconnect mx-1"></i>Connecting...
                    </div>
                  `
      )}
              `,
      () => html`
                <div class="text-sm mt-1 text-gray-400">By: <i class="mdi mdi-laptop mx-1"></i>${this.miner}</div>
              `
    )}
          </div>
        </div>
        <div class="mt-2 blocks-table">
          <div class="flex block-header uppercase py-2 border-y">
            <div class="flex-none w-20 p-2">BLOCK</div>
            <div class="flex-1 p-2 ">timestamp</div>
            <div class="flex-1 p-2">HASH</div>
            <div class="flex-1 p-2 text-right">miner</div>
            <div class="flex-1 p-2 text-right">transactionsRoot</div>
          </div>
          ${when(
      !this.loading,
      () => html`
              ${repeat(this.miner ? this.minerBlocks : uiBlocks.blocks, (block) =>
        keyed(
          block.height,
          html`<div
                    class="flex overflow-hidden bg-gray-100 rounded-lg mt-2 cursor-pointer h-14 items-center py-2 hover_bg-gray-300 ${classMap(
            { incoming: !!block.incoming }
          )}"
                    @click="${() => this.goto(block)}"
                  >
                    <div class="flex-none w-20 p-2 text-blue-500 underline">${block.height}</div>
                    <div class="flex-1 p-2 truncate">${new Date(block.timestamp * 1000).toLocaleString()}</div>
                    <div class="flex-1 p-2 truncate">${block.parentHash}</div>
                    <div class="flex-1 p-2 text-right truncate">${block.miner}</div>
                    <div class="flex-1 p-2 text-right truncate">${block.transactionsRoot}</div>
                  </div>`
        )
      )}
            `,
      () => html`
              <div class="text-center p-3 border-t-2">
                <loading-icon type="inline-block"></loading-icon>
              </div>
            `
    )}
          ${when(
      this.miner && this.minerData.totalPage,
      () => html`
              <div class="flex justify-center items-center my-4">
                <dui-button title="First Page" icon class="text-blue-500" @click=${() => this.getMinerBlocks(1)}
                  ><i class="mdi mdi-page-first text-lg"></i
                ></dui-button>
                <dui-button
                  title="Previous Page"
                  icon
                  class="text-blue-500"
                  @click=${() => this.getMinerBlocks(this.minerData.page - 1)}
                >
                  <i class="mdi mdi-chevron-left text-lg"></i>
                </dui-button>
                <div class="text-gray-300 text-sm inline-block mx-1">
                  Page ${this.minerData.page} of ${this.minerData.totalPage}
                </div>
                <dui-button
                  title="Next Page"
                  icon
                  class="text-blue-500"
                  @click=${() => this.getMinerBlocks(this.minerData.page + 1)}
                >
                  <i class="mdi mdi-chevron-right text-lg"></i>
                </dui-button>
                <dui-button
                  title="Last Page"
                  icon
                  class="text-blue-500"
                  @click=${() => this.getMinerBlocks(this.minerData.totalPage)}
                >
                  <i class="mdi mdi-page-last text-lg"></i>
                </dui-button>
              </div>
            `
    )}
        </div>
      </div>
    </div>`
  }
}
