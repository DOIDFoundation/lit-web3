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
    const network = EvmNetworks.ethereum_mainnet

    network.rpcUrl = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    const chainProvider = new EvmChainProvider(network)
    const walletOptions = {
      mnemonic: 'diary wolf balcony magnet view mosquito settle gym slim target divert all',
      derivationPath: `m/44'/${network.coinType}'/0'/0/0`,
      network: network
    }

    const walletProvider = new EvmWalletProvider(walletOptions, chainProvider)

    const { method, params } = ctx.req.body
    console.log('method', method, 'params', params)

    var response: any = ''
    if (method === 'eth_accounts') {
      const accounts = await walletProvider.getSigner().address
      response = [accounts]
    } else if (method === 'eth_chainId') {
      const chainId = await walletProvider.getSigner().getChainId()
      response = chainId
    } else if (method === 'eth_requestAccounts') {
      const accounts = await walletProvider.getSigner().address
      response = [accounts]
    } else if (method === 'eth_getBalance') {
      const balance = await walletProvider.getSigner().getBalance()
      response = balance
    } else if (method == 'personal_sign') {
      response = await walletProvider.getSigner().signMessage(params[0])
    }
    ctx.res.body = response
  }
}
