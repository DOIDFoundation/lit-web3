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
  "0X38": {
    chainId: '0X38',
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
  }
}

export const SupportNetworks = ['0xd01d', '0xdddd']

export const unknownNetwork = {
  title: 'Unsupported Network',
  name: 'unknown',
  chainId: '',
  provider: '',
  scan: '',
  icon: ''
}

export default AllNetworks
