// All Networks
const apiKeyInfura = import.meta.env.VITE_KEY_INFURA
export function chainIdStr(chainId: number): string {
  return '0x' + chainId.toString(16)
}
// @todo seems native is unused
// export const native = { name: 'Ethereum', symbol: 'ETH', decimals: 18 }

export const AllNetworks = {
  '0xd01d': {
    chainId: '0xd01d',
    title: 'DOID',
    name: 'doid',
    native: {
      decimals: 18,
      name: 'DOID',
      symbol: 'DOID'
    },
    provider: 'https://rpc.doid.tech/',
    providerWs: 'ws://rpc.doid.tech/ws',
    scan: 'https://scan.doid.tech',
    icon: ''
  },
  '0xdddd': {
    chainId: '0xdddd',
    title: 'DOID Testnet',
    name: 'doid-testnet',
    native: {
      decimals: 18,
      name: 'DOID',
      symbol: 'DOID'
    },
    provider: 'https://rpc.testnet.doid.tech/',
    providerWs: 'ws://rpc.testnet.doid.tech/ws',
    scan: 'https://scan.testnet.doid.tech',
    icon: ''
  },
  "0x1": {
    chainId: '0x1',
    title: 'Ethereum',
    name: 'Ethereum Mainnet',
    native: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH'
    },
    provider: 'https://mainnet.infura.io/v3/',
    providerWs: 'wss://mainnet.infura.io/ws/v3/',
    scan: 'https://etherscan.io',
    icon: ''
  },
  "0x38": {
    chainId: '0x38',
    title: 'BNB',
    name: 'BNB Smart Chain Mainnet',
    native: {
      decimals: 18,
      name: 'BNB',
      symbol: 'BNB'
    },
    provider: 'https://bsc-dataseed1.binance.org/',
    providerWs: 'wss://bsc-dataseed1.binance.org/',
    scan: 'https://bscscan.com',
    icon: ''
  },
  "0xa4b1": {
    chainId: '0xa4b1',
    title: 'Arbitrum',
    name: 'Arbitrum LlamaNodes',
    native: {
      decimals: 18,
      name: 'ARB',
      symbol: 'ARB'
    },
    provider: 'https://arbitrum.llamarpc.com',
    providerWs: 'wss://arbitrum-one.publicnode.com',
    scan: 'https://sepolia.arbiscan.io',
    icon: ''
  },
  "0xfa": {
    chainId: '0xfa',
    title: 'FTM',
    name: 'Fantom Opera',
    native: {
      decimals: 18,
      name: 'FTM',
      symbol: 'FTM'
    },
    provider: 'https://fantom.blockpi.network/v1/rpc/public',
    providerWs: 'wss://fantom.publicnode.com',
    scan: 'https://ftmscan.com',
    icon: ''
  },
  "0xa86a": {
    chainId: '0xa86a',
    title: 'AVAX',
    name: 'Avalanche C-Chain',
    native: {
      decimals: 18,
      name: 'AVAX',
      symbol: 'AVAX'
    },
    provider: 'https://api.avax.network/ext/bc/C/rpc',
    providerWs: 'wss://avalanche-c-chain.publicnode.com',
    scan: 'https://snowtrace.io',
    icon: ''
  },
  "0x89": {
    chainId: '0x89',
    title: 'MATIC',
    name: 'Polygon Mainnet',
    native: {
      decimals: 18,
      name: 'MATIC',
      symbol: 'MATIC'
    },
    provider: 'https://polygon.llamarpc.com',
    providerWs: 'wss://polygon-bor.publicnode.com',
    scan: 'https://polygonscan.com',
    icon: ''
  },
  "0xa": {
    chainId: '0xa',
    title: 'OP Mainnet',
    name: 'OP Mainnet',
    native: {
      decimals: 18,
      name: 'OP',
      symbol: 'OP'
    },
    provider: 'https://optimism.llamarpc.com',
    providerWs: 'wss://optimism.publicnode.com',
    scan: 'https://optimistic.etherscan.io',
    icon: ''
  }
}

export const SupportNetworks = ['0xd01d', '0xdddd', '0x1', '0x38']

export const unknownNetwork = {
  title: 'Unsupported Network',
  name: 'unknown',
  chainId: '',
  provider: '',
  scan: '',
  icon: ''
}

export default AllNetworks
