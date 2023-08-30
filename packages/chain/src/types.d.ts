declare type ChainName = 'doid' | 'ethereum' | 'solana' | 'aptos' | 'bitcoin'

declare type ChainId = string

declare interface BlockChain {
  readonly name: ChainName
  readonly title?: string
  readonly symbol?: string
}
declare type BlockChains = BlockChain[]

declare interface ChainNetwork extends BlockChain {
  readonly id: ChainId
  readonly abbr?: string
  readonly rpc?: string
  readonly rpcWs?: string
  readonly scan?: string
  readonly icon?: string
  readonly color?: string
  readonly testnet?: boolean
}

declare type Chainish = ChainName | ChainId | ChainNetwork

declare type ChainNetworks = ChainNetwork[] // 0 as default (mainnet)
declare type Chain = {
  [chainId in ChainId]: ChainNetwork
}

declare type MultiChain = readonly {
  [chainName in ChainName]: ChainNetworks
}
