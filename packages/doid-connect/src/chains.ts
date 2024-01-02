import { Chain, defineChain } from 'viem'
import { fantomTestnet as ftn } from 'viem/chains'

export { type Chain, defineChain } from 'viem'

// not ready yet
export const doid: Chain = defineChain({
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
