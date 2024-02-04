import { Chain, defineChain } from 'viem'

export { type Chain, defineChain } from 'viem'

export const doid: Chain = defineChain({
  id: 0xd01d,
  name: 'DOID',
  network: 'doid',
  nativeCurrency: {
    decimals: 18,
    name: 'DOID',
    symbol: 'DOID'
  },
  rpcUrls: {
    default: { http: ['https://rpc.doid.tech'] },
    public: { http: ['https://rpc.doid.tech'] }
  },
  blockExplorers: {
    default: { name: 'DOID Explorer', url: 'https://scan.doid.tech' }
  },
  contracts: {
    ensRegistry: {
      address: '0x61412955195691E47c99f1Ca202A0e558db24393'
    },
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11'
    }
  }
})

export const doidTestnet: Chain = defineChain({
  id: 0xdddd,
  name: 'DOID Testnet',
  network: 'doid-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'DOID',
    symbol: 'DOID'
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.doid.tech'] },
    public: { http: ['https://rpc.testnet.doid.tech'] }
  },
  blockExplorers: {
    default: { name: 'DOID Testnet Explorer', url: 'https://scan.testnet.doid.tech' }
  },
  contracts: {
    ensRegistry: {
      address: '0x6974201EaAEb277888F6a4028d952E6A59F0baD1'
    },
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11'
    }
  }
})

export const fantomTestnet: Chain = defineChain({
  id: 4_002,
  name: 'Fantom Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Fantom',
    symbol: 'FTM'
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.fantom.network'] }
  },
  blockExplorers: {
    default: {
      name: 'FTMScan',
      url: 'https://testnet.ftmscan.com',
      apiUrl: 'https://testnet.ftmscan.com/api'
    }
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 8328688
    },
    ensRegistry: {
      address: '0x6974201EaAEb277888F6a4028d952E6A59F0baD1'
    }
  }
})
