type Block = {
  height: number
  timestamp: number
  miner: string
  parentHash: string
  transactionsRoot: string
  incoming?: boolean
}
type ReqMsg = {
  method: string
  params: string[]
  jsonrpc: '2.0'
}
type ResMsg = {
  method: string
  params: {
    result: !{ header: Block }
  }
}
