import { Chain, defineChain } from 'viem'
import { fantomTestnet, goerli } from 'viem/chains'

// not ready yet
export const doid: Chain = defineChain({
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

export const doidTestnet: Chain = defineChain({
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
