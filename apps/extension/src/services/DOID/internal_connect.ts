// import backgroundMessenger from '~/lib.next/messenger/background'
import backgroundMessenger from '~/lib.next/messenger/background'
// import { Network, WalletOptions } from '@chainify/types'

// import { EvmNetworks, EvmChainProvider, EvmWalletProvider } from '@chainify/evm'

// import { providers } from 'lit-chain/node_modules/ethers'
export const internal_connect: BackgroundService = {
  method: 'internal_connect',
  middlewares: [],
  fn: async (ctx) => {
    console.log('connect')
    const { doid = '', mnemonic, json = {} } = ctx.req.body
    try {
      // backgroundMessenger.send('DOID_account_update', { mainAddress: true })
      // const network = EvmNetworks.ganache
      // const walletOptions = {
      //   mnemonic: 'diary wolf balcony magnet view mosquito settle gym slim target divert all',
      //   derivationPath: `m/44'/${network.coinType}'/0'/0/0`
      // }

      // console.log('rpcurl', network.rpcUrl)
      // const provider = new providers.StaticJsonRpcProvider(network.rpcUrl)
      // const chainProvider = new EvmChainProvider(network, provider)
      // const walletProvider = new EvmWalletProvider(walletOptions, chainProvider)

      ctx.res.body = { success: 'ok' }
    } catch (e) {
      throw e
    }
    // backgroundMessenger.on('reply_DOID_setup', ({ data }) => {

    // })
  }
}
