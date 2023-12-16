import { defineChain } from 'viem'
import { fantomTestnet, goerli } from 'viem/chains'

export * from '@wagmi/core/chains'

// not ready yet
export const doid = defineChain({
  ...goerli,
  contracts: {
    ...goerli.contracts,
    ...{
      ensRegistry: {
        address: '0x6974201EaAEb277888F6a4028d952E6A59F0baD1'
      }
    }
  }
})

export const doidTestnet = defineChain({
  ...fantomTestnet,
  contracts: {
    ...fantomTestnet.contracts,
    ...{
      ensRegistry: {
        address: '0x6974201EaAEb277888F6a4028d952E6A59F0baD1'
      }
    }
  }
})
