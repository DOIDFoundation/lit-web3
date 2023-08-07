import { TailwindElement, html, customElement, state, when, property } from '@lit-web3/dui/src/shared/TailwindElement'
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/loading/icon'
import '../../components/search/index'
import { goto } from '@lit-web3/dui/src/shared/router'
// import http from '@lit-web3/core/src/http'
import jsonRpcRequest from '@lit-web3/core/src/http/jsonRpcRequest'
import '@lit-web3/dui/src/button'

import style from './home.css?inline'
@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  @property() miner = ''
  @state() blockData: any = []
  @state() minerData: any = { data: [], totalPage: 0, blockData: [], page: 1 }
  @state() pending = false
  @state() isConnect = false

  socket = new WebSocket('ws://54.221.168.235:8557');
  // socket:any = null;
  goto = (block: any) => {
    const _block = JSON.stringify(block);
    goto(`/block/${_block}`)
  }
  async getMinterData(page: number) {
    console.log(page, 'page');
    if (page < 1) page = 1
    if (this.minerData.totalPage != 0 && page >= this.minerData.totalPage) page = this.minerData.totalPage
    this.minerData.blockData = []
    const isProd = import.meta.env.MODE === 'production'
    const rpcUrl = isProd ? 'http://54.221.168.235:8556' : `${location.origin}/jsonrpc/`
    const result: any = await jsonRpcRequest(rpcUrl, "doid_getBlockByMiner", [{ "miner": `${this.miner.toLowerCase()}`, "limit": 10, "page": page }])
    console.log(result, 'result');
    // this.minerData.data = [31389, 31389, 31437, 31437, 31550, 31695, 31803, 31809, 31839]a7497216abf4ca75652ad33e6200328f4c41bb3f
    if (result == null) return
    this.minerData.data = result.data
    this.minerData.totalPage = result.totalPage
    this.minerData.page = page
    const onSendData = () => {
      for (let index in this.minerData.data) {
        this.socket.send(`{"jsonrpc":"2.0","id":4,"method":"doid_getBlockByHeight","params":[${this.minerData.data[index]}]}`)
      }
    }
    if (this.socket.readyState === WebSocket.OPEN) {
      onSendData()
    }
    this.socket.addEventListener('open', function (event) {
      onSendData()
    })
  }
  runWs() {
    const that = this;
    that.pending = true
    this.isConnect = false;
    this.blockData = [];
    const socket = this.socket;
    socket.addEventListener('open', function (event) {
      socket.send('{"jsonrpc":"2.0","id":1,"method":"doid_currentBlock","params":[]}')
      socket.send('{"jsonrpc": "2.0", "method": "doid_subscribe", "params": ["newHeads"], "id": 2}')
      // console.log(socket, 'socket', WebSocket.OPEN);
    });

    // {data
    // :
    // (9) [31389, 31389, 31437, 31437, 31550, 31695, 31803, 31809, 31839]
    // totalPage
    // :
    // 1025}

    socket.addEventListener('message', function (event) {
      const result = JSON.parse(event.data)
      that.getData(result)
      // console.log(result.result)


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
    if (params.id == 1 || params.id == 3) {
      this.blockData.unshift(params.result.header)
      // this.pending = false
    }
    if (params.method === 'doid_subscription' && params.id == 2) {
      this.blockData.unshift(params.params.result.header)
    }
    if (params.id === 1) {
      const block = params.result.header.height
      for (let index = block - 1; index > block - 30; index--) {
        this.socket.send(`{"jsonrpc":"2.0","id":3,"method":"doid_getBlockByHeight","params":[${index}]}`)
      }
    }
    if (params.id == 4 && params.result) {
      this.minerData.blockData.unshift(params.result.header)
    }
    this.blockData = this.blockData.slice(0, 30).sort((a: any, b: any) => b.height - a.height)
    this.minerData.blockData = this.minerData.blockData.slice(0, 30).sort((a: any, b: any) => b.height - a.height)
    // console.log('paraams', this.blockData, this.pending);
    // console.log(this.minerData.blockData);

  }
  connectedCallback(): void {
    super.connectedCallback()
    this.runWs();
    if (this.miner) {
      this.getMinterData(1)
    }
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
          <!-- <dui-ns-search @search="" placeholder="Search Explorer"></dui-ns-search> -->
        </div>
        <div class="mt-2 flex justify-between items-center">
          <div class="text-3xl">${when(!this.miner, () => 'Latest Blocks', () => html`
          <div class="text-blue-700 font-bold cursor-pointer uppercase text-sm" @click="${() => { history.back() }}"><i class="mdi mdi-arrow-left mx-1"></i>
              Back</div>
            <div>Blocks</div>

          `)}</div>

          <div>
          ${when(!this.miner, () => html`
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

          `, () => html`

          <div class="text-sm mt-1 text-gray-400">By: <i class="mdi mdi-laptop mx-1"></i>${this.miner}</div>
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
            ${(!!this.miner ? this.minerData.blockData : this.blockData).map((item: any, idx: any) =>
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

          ${when(!this.pending && !!this.miner, () => html`
            <div class="flex justify-center items-center">
              <dui-button icon sm class="text-blue-500" @click=${() => this.getMinterData(1)}>
                First
              </dui-button>
              <dui-button icon sm class="text-blue-500" @click=${() => {
          const page = this.minerData.page - 1
          this.getMinterData(page)
        }}>
                <i class="mdi mdi-menu-left text-lg"></i>
              </dui-button>
              <div class="text-gray-300 text-sm inline-block">Page ${this.minerData.page} of ${this.minerData.totalPage}</div>
              <dui-button icon sm class="text-blue-500" @click=${() => {
          const page = this.minerData.page + 1
          this.getMinterData(page)
        }}>
                <i class="mdi mdi-menu-right text-lg"></i>
              </dui-button>
              <dui-button icon sm class="text-blue-500" @click=${() => this.getMinterData(this.minerData.totalPage)}>
                Last
              </dui-button>
            </div>
          `)}

        </div>
      </div>
    </div>`
  }
}
