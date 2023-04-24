export enum ChainName {
  ethereum = 'ethereum',
  solana = 'solana',
  aptos = 'aptos',
  bnb = 'bnb',
  bitcoin = 'bitcoin'
}
export enum ChainCoin {
  ethereum = 'eth',
  solana = 'sol',
  aptos = 'apt',
  bnb = 'bnb',
  bitcoin = 'btc'
}

export const ChainsDefaultDef = (): ChainNet[] => {
  return [
    { name: ChainName.ethereum, title: 'Ethereum', coin: ChainCoin.ethereum },
    { name: ChainName.bitcoin, title: 'BitCoin', coin: ChainCoin.bitcoin },
    { name: ChainName.bnb, title: 'BNB Smart Chain', coin: ChainCoin.bnb },
    { name: ChainName.aptos, title: 'Aptos', coin: ChainCoin.aptos },
    { name: ChainName.solana, title: 'Solana', coin: ChainCoin.solana }
  ].filter((r) => r.name != 'bitcoin')
}

export const chainsDefault = ChainsDefaultDef()

export interface Network {
  name: string
  id: string
}
export type ChainNetwork = {
  [key in ChainName]: Network[]
}
export type SelectedChain = {
  [key in ChainName]: {
    id: string
  }
}
export const chainNetworks: ChainNetwork = Object.freeze({
  [ChainName.ethereum]: [
    { name: 'Ethereum Mainnet', id: '0x1' },
    { name: 'Ethereum Goerli', id: '0x5' },
    { name: 'Ethereum Sepolia', id: '0xaa36a7' }
  ],
  [ChainName.bnb]: [
    { name: 'BNB Smart Chain', id: '0x38' },
    { name: 'BNB Smart Chain Testnet', id: '0x61' }
  ],
  [ChainName.aptos]: [
    { name: 'Aptos Mainnet', id: '1' },
    { name: 'Aptos Testnet', id: '2' }
  ],
  [ChainName.solana]: [
    { name: 'Solana Mainnet', id: '' },
    { name: 'Solana Testnet', id: 'testnet' }
  ],
  [ChainName.bitcoin]: []
})
