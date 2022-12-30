declare type Address = `0x${string}` | string
declare type TokenID = `${number}` // >= 0
declare type TokenURI = `http${string}.json` | ''

declare interface Meta {
  name: string
  description: string
  image: string
  creator: string
  publisher: string
  external_url?: string
  properties: Record<string, any>
}

declare interface NFTToken {
  address?: Address
  tokenID?: TokenID
  name?: string
  uri?: string // ERC1155 asis ERC721 tokenURI
  tokenURI?: string
  block?: number
  ctime?: number
  utime?: number
  meta?: Meta
  // Details
  owner?: Address
  value?: number
  total?: string
  txHash?: Address
  txs?: NFTTokenTxs
  seq?: string
  sequence?: string
  approved?: boolean
}
declare interface Token {
  name?: string
  address: Address
  id?: TokenID
  meta?: Meta
  contract?: Address
}

declare type Tokenish = NFTToken | Token | string | any
declare type NFTTokenish = NFTToken | any
declare type NFTTokenTxCate = string | 'mint' | 'burn' | 'transfer' | 'unknown'

declare interface NFTTokenTx {
  txHash: Address
  ts: number
  from: Address
  to: Address
  block: number
  cate: NFTTokenTxCate
}
declare type NFTTokenTxs = NFTTokenTx[]

declare type getContractOpts = {
  forceMainnet?: boolean
  address?: string
  abiName?: string
  account?: Address
  requireAccount?: boolean
}
