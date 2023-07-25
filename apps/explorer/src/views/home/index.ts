import { TailwindElement, html, customElement, state, when, property } from '@lit-web3/dui/src/shared/TailwindElement'
// import { goto } from '@lit-web3/dui/src/shared/router'
// Components
import '../../components/search/index'
import '@lit-web3/dui/src/doid-symbol'
import '@lit-web3/dui/src/loading/icon'

import style from './home.css?inline'
@customElement('view-home')
export class ViewHome extends TailwindElement(style) {
  @state() blockData: any = []
  @state() pending = false
  goto = (e: CustomEvent) => {
    // goto(`/search/${e.detail}`)
  }

  runWs() {
    const socket = new WebSocket('ws://54.91.9.8:8557');
    const that = this;
    socket.addEventListener('open', function (event) {
      socket.send('{"jsonrpc":"2.0","id":1,"method":"doid_currentBlock","params":[]}')
      socket.send('{"jsonrpc": "2.0", "method": "doid_subscribe", "params": ["newHeads"], "id": 1}')
      that.pending = true
    });

    socket.addEventListener('message', function (event) {
      const result = JSON.parse(event.data)
      that.getData(result)

      // console.log(that.blockData, that.pending);

    });

    socket.addEventListener('close', function (event) {
    });

    socket.addEventListener('error', function (event) {
    });
  }

  getData(params: any) {
    if (params.result && params.result.header) {
      this.blockData.unshift(params.result.header)
      this.pending = false
    }
    if (params.method === 'doid_subscription') {
      this.blockData.unshift(params.params.result.header)
      this.pending = false
    }
    this.blockData = this.blockData.slice(0, 30)
    // console.log('paraams', this.blockData, this.pending);

  }
  connectedCallback(): void {
    this.runWs();
    super.connectedCallback()
    console.log(111);

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
          <dui-ns-search @search=${this.goto} placeholder="Search Explorer"></dui-ns-search>
        </div>
        <div class="text-3xl mt-2">Latest Blocks</div>
        <div class="mt-2 blocks-table">
          <div class="flex block-header uppercase">
            <div class="flex-1 p-2">BLOCK</div>
            <div class="flex-1 p-2 ">timestamp</div>
            <div class="flex-1 p-2">HASH</div>
            <div class="flex-1 p-2 text-right">miner</div>
            <div class="flex-1 p-2 text-right">transactionsRoot</div>
          </div>
          ${when(!this.pending, () => html`
            ${this.blockData.map((item: any, idx: any) =>
      html`<div class="flex bg-gray-200 rounded-lg ${when(idx > 0, () => `mt-2`)} cursor-pointer">
              <div class="flex-1 p-2 text-blue-500">${item.height}</div>
              <div class="flex-1 p-2 truncate">${item.timestamp}</div>
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

          <!-- <div class="flex bg-gray-200 rounded-lg mt-1  cursor-pointer">
            <div class="flex-1 p-2">BLOCK</div>
            <div class="flex-1 p-2">AGE</div>
            <div class="flex-1 p-2">HASH</div>
            <div class="flex-1 p-2 text-right">FIRST VERSION</div>
            <div class="flex-1 p-2 text-right">LAST VERSION</div>
          </div> -->
        </div>
      </div>
    </div>`
  }
}
