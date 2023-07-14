export enum ChainName {
  ethereum = 'ethereum',
  solana = 'solana',
  aptos = 'aptos',
  bsc = 'bsc',
  bitcoin = 'bitcoin'
}
export enum ChainCoin {
  ethereum = 'eth',
  solana = 'sol',
  aptos = 'apt',
  bsc = 'bnb',
  bitcoin = 'btc'
}

export const ChainsDefaultDef = (): ChainNet[] => {
  return [
    { name: ChainName.ethereum, title: 'Ethereum', coin: ChainCoin.ethereum },
    // { name: ChainName.bitcoin, title: 'BitCoin', coin: ChainCoin.bitcoin },
    { name: ChainName.bsc, title: 'BNB Smart Chain', coin: ChainCoin.bsc },
    { name: ChainName.aptos, title: 'Aptos', coin: ChainCoin.aptos },
    { name: ChainName.solana, title: 'Solana', coin: ChainCoin.solana }
  ].filter((r) => r.name != 'bitcoin')
}

export const chainsDefault = ChainsDefaultDef()

export interface Network {
  name: string
  id: string
  rpc: string[]
}
export type ChainNetwork = {
  [key in ChainName]: Network[]
}
export type SelectedChain = {
  [key in ChainName]: {
    id: string
  }
}
export const getNetwork = (name: keyof typeof ChainName, chainId: string) => {
  const networks = chainNetworks[name]
  return networks.find((r) => r.id === chainId || +r.id === +chainId) ?? networks[0]
}
export const chainNetworks: ChainNetwork = Object.freeze({
  [ChainName.ethereum]: [
    { name: 'Ethereum Mainnet', id: '0x1', rpc: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'] },
    { name: 'Ethereum Goerli', id: '0x5', rpc: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'] },
    { name: 'Ethereum Sepolia', id: '0xaa36a7', rpc: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'] }
  ],
  [ChainName.bsc]: [
    { name: 'BNB Smart Chain', id: '0x38', rpc: ['https://bsc-dataseed.binance.org'] },
    { name: 'BNB Smart Chain Testnet', id: '0x61', rpc: ['https://data-seed-prebsc-1-s1.binance.org:8545'] }
  ],
  [ChainName.aptos]: [
    { name: 'Aptos Mainnet', id: '1', rpc: ['http://aptos-mainnet-rpc.allthatnode.com/v1'] },
    { name: 'Aptos Testnet', id: '2', rpc: ['http://aptos-testnet-rpc.allthatnode.com/v1'] }
  ],
  [ChainName.solana]: [
    { name: 'Solana Mainnet', id: '', rpc: ['https://api.mainnet-beta.solana.com'] },
    { name: 'Solana Testnet', id: 'testnet', rpc: ['https://api.testnet.solana.com'] }
  ],
  [ChainName.bitcoin]: [{ name: 'Bitcoin Mainnet', id: '', rpc: [] }]
})
