import { TailwindElement, html, customElement, state, when, property } from '@lit-web3/dui/src/shared/TailwindElement'
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/loading/icon'
import { goto } from '@lit-web3/dui/src/shared/router'

import style from './home.css?inline'
@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  @state() blockData: any = []
  @state() pending = false
  @state() isConnect = false

  // socket:any = null;
  goto = (block: any) => {
    const _block = JSON.stringify(block);
    goto(`/block/${_block}`)
  }

  runWs() {
    const that = this;
    that.pending = true
    this.isConnect = false;
    this.blockData = [];
    const socket = new WebSocket('ws://54.91.9.8:8557');
    socket.addEventListener('open', function (event) {
      socket.send('{"jsonrpc":"2.0","id":1,"method":"doid_currentBlock","params":[]}')
      socket.send('{"jsonrpc": "2.0", "method": "doid_subscribe", "params": ["newHeads"], "id": 2}')
      // socket.send('{"jsonrpc":"2.0","id":3,"method":"doid_getBlockByHeight","params":[2589]}')

    });

    socket.addEventListener('message', function (event) {
      const result = JSON.parse(event.data)
      that.getData(result)
      // console.log(result.result)

      if (result.id === 1) {
        const block = result.result.header.height
        for (let index = block - 1; index > block - 30; index--) {
          socket.send(`{"jsonrpc":"2.0","id":3,"method":"doid_getBlockByHeight","params":[${index}]}`)
        }
      }
      that.pending = false
      that.isConnect = true;
      // console.log(that.blockData, that.pending);
    });

    socket.addEventListener('close', function (event) {
      that.runWs()
      that.isConnect = false;
    });

    socket.addEventListener('error', function (event) {
      that.runWs()
      that.isConnect = false;
    });
  }
  reloadSocket() {
    location.reload()
  }
  getData(params: any) {
    if (params.result && params.result.header) {
      this.blockData.unshift(params.result.header)
      // this.pending = false
    }
    if (params.method === 'doid_subscription') {
      this.blockData.unshift(params.params.result.header)

    }
    this.blockData = this.blockData.slice(0, 30).sort((a: any, b: any) => b.height - a.height)
    // console.log('paraams', this.blockData, this.pending);

  }
  connectedCallback(): void {
    super.connectedCallback()
    this.runWs();
  }
  render() {
    return html`<div class="home">
      <!-- <p class="my-4 text-center">
        If you have locked a name with lockpass before, click&nbsp;<dui-link href="https://lockpass.doid.tech/passes"
          >here</dui-link
        >&nbsp;to redeem your DOID.
      </p> -->
      <div class="dui-container">
        <!-- <doid-symbol>
          <span slot="h1">Your Decentralized OpenID</span>
          <p slot="msg" class="my-2">Safer, faster and easier entrance to chains, contacts and dApps</p>
        </doid-symbol> -->
        <div class="mx-auto">
          <!-- <dui-ns-search @search=${this.goto} placeholder="Search Explorer"></dui-ns-search> -->
        </div>
        <div class="mt-2 flex justify-between items-center">
          <div class="text-3xl">Latest Blocks</div>
          <div>
            ${when(this.isConnect,
      () => html`<div class="text-green-600">
                    <span class="relative inline-flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-green-700"></span>
                    </span>
                    <!-- <i class="mdi mdi-lan-connect mx-1"></i> -->
                    Connected</div>`,
      () => html`
             <div class="text-red-600 inline-block"><i class="mdi mdi-lan-disconnect mx-1"></i>Disconnected</div>
             <i class="mdi mdi-reload mx-1 text-green-600 cursor-pointer" @click="${this.reloadSocket}"></i>
          `)}

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
          ${when(!this.pending, () => html`
            ${this.blockData.map((item: any, idx: any) =>
        html`<div
          class="flex bg-gray-100 rounded-lg mt-2 cursor-pointer  py-2 hover_bg-gray-300"
          @click="${() => { this.goto(item) }}">
              <div class="flex-none w-20 p-2 text-blue-500 underline">${item.height}</div>
              <div class="flex-1 p-2 truncate">${new Date(item.timestamp * 1000).toUTCString()}</div>
              <div class="flex-1 p-2 truncate">${item.parentHash}</div>
              <div class="flex-1 p-2 text-right truncate">${item.miner}</div>
              <div class="flex-1 p-2 text-right truncate">${item.transactionsRoot}</div>
            </div>`
      )}
          `, () => html`
          <div class="text-center p-3 border-t-2">
          <loading-icon type="inline-block"></loading-icon>
          </div>
          `)}
        </div>
      </div>
    </div>`
  }
}
