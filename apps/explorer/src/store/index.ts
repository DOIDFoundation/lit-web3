export { StateController } from '@lit-app/state'
import { State, property } from '@lit-app/state'
// @ts-expect-error
import WS from 'ws-sequence'
import { defaultNetwork } from '@lit-web3/doids/src/networks'

export const DOIDProviderWs = new WS({ uri: defaultNetwork.providerWs })

export const wsSend = async (params: Record<string, unknown>, cb?: Function) =>
  DOIDProviderWs.send({ jsonrpc: '2.0', ...params }, cb)

const cacheKey = `blocks.${defaultNetwork.chainId}`
const cachedBlocks: Block[] = JSON.parse(sessionStorage.getItem(cacheKey) ?? '[]').map((block: Block) => {
  delete block.incoming
  return block
})

class UIBlocks extends State {
  @property({ value: DOIDProviderWs }) ws!: any
  @property({ value: false }) pending!: boolean
  @property({ value: 0 }) ts!: number
  @property({ value: 20 }) limit!: number
  @property({ value: cachedBlocks }) blocks!: Block[]

  delay = 3000

  get isEmpty() {
    return this.ts && !this.blocks.length
  }
  get loading() {
    return !this.ts
  }
  get isConnected() {
    const {
      ws: { readyState, OPEN }
    } = this.ws
    return readyState === OPEN
  }

  updateBlocks = async () => {
    const now = new Date().getTime()
    this.blocks = this.blocks.map((block) => {
      const { incoming = false, timestamp = 0 } = block
      if (incoming && timestamp && now - +timestamp * 1000 > this.delay) delete block.incoming
      return block
    })
    sessionStorage.setItem(cacheKey, JSON.stringify(this.blocks))
  }
  addBlock = (block: Block, update = false) => {
    if (!block || this.blocks.some((r) => r.height === block.height)) return
    block.incoming = true
    setTimeout(() => (block.incoming = false), this.delay)
    this.blocks.unshift(block)
    this.blocks.sort((a, b) => b.height - a.height)
    this.blocks.length = Math.min(this.limit, this.blocks.length)
    if (update) this.updateBlocks()
  }

  // TODO: diff & merge
  getBlocks = async () => {
    this.pending = true
    wsSend({ method: 'doid_currentBlock', params: [] }, ({ header } = <unknown>{}) => {
      this.addBlock(header)
      for (let index = header.height - 1; index > header.height - this.limit; index--) {
        wsSend({ method: 'doid_getBlockByHeight', params: [index] }, (res: any) => {
          this.addBlock(res?.header)
          this.ts++
        })
      }
    })
    this.updateBlocks()
    this.pending = false
  }
  constructor() {
    super()
    // Init
    this.getBlocks()
    wsSend({ method: 'doid_subscribe', params: ['newHeads'] })
    // Subscribe
    this.ws.on('message', ({ method, params } = <ResMsg>{}) => {
      if (!params) return
      const { header } = params?.result
      switch (method) {
        case 'doid_subscription':
          if (header) this.addBlock(header, true)
          return
      }
    })
    // On reconnected
    this.ws.on('open', this.getBlocks)
  }
}

export const uiBlocks = new UIBlocks()
