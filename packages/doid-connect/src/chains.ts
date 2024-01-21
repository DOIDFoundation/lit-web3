import { Chain, defineChain } from 'viem'
import { fantomTestnet as ftn } from 'viem/chains'

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
      address: '0x8b2afF81fec4E7787AeeB257b5D99626651Ee43F'
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
  ...ftn,
  contracts: {
    ...ftn.contracts,
    ...{
      ensRegistry: {
        address: '0x6974201EaAEb277888F6a4028d952E6A59F0baD1'
      }
    }
  }
})
