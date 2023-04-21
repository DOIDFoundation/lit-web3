import backgroundMessenger from '~/lib.next/messenger/background'
import { inpageLogger } from '~/lib.next/logger'
import { openPopup, closePopup } from '~/lib.next/background/notifier'
import { providers } from 'ethers'
import { EvmChainProvider, EvmNetworks, EvmWalletProvider } from '@chainify/evm'

export const EVM_request: BackgroundService = {
  method: 'evm_request',
  allowInpage: true,
  middlewares: [],
  fn: async (ctx) => {
    // const network = EvmNetworks.ganache
    // const provider = new providers.StaticJsonRpcProvider(network.rpcUrl)
    // const chainProvider = new EvmChainProvider(network, provider)
    // const walletOptions = {
    //   mnemonic: 'diary wolf balcony magnet view mosquito settle gym slim target divert all',
    //   derivationPath: `m/44'/${network.coinType}'/0'/0/0`
    // }
    // const walletProvider = new EvmWalletProvider(walletOptions, chainProvider)
    // // console.log(walletProvider)
    // console.log('---------------')

    const { method, param } = ctx.req.body
    var response: any = ''
    if (method === 'eth_accounts') {
      // const addresses = await walletProvider.getAddresses()
      // return addresses
      response = ['0x70997970c51812dc3a010c7d01b50e0d17dc79c8']
    } else if (method === 'eth_chainId') {
      // response = '0x7a69'
      response = '0x1'
    } else if (method === 'eth_requestAccounts') {
      response = ['0x70997970c51812dc3a010c7d01b50e0d17dc79c8']
    } else if (method === 'eth_getBalance') {
      response = '0x2710'
    }
    ctx.res.body = response
  }
}

// backgroundMessenger.on('evm_request', ({ data }) => {
//   return new Promise(async (resolve) => {
//     resolve([])
//   })
// })
