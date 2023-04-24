import backgroundMessenger from '~/lib.next/messenger/background'
import { inpageLogger } from '~/lib.next/logger'
import { openPopup, closePopup } from '~/lib.next/background/notifier'
import { providers } from 'ethers'
import { EvmChainProvider, EvmNetworks, EvmWalletProvider } from '@chainify/evm'
import { log } from 'loglevel'
import { getKeyring } from '~/lib.next/keyring'

export const EVM_request: BackgroundService = {
  method: 'evm_request',
  allowInpage: true,
  middlewares: [],
  fn: async (ctx) => {
    const keyrings = (await getKeyring()).keyrings
    if (keyrings.length === 0) throw new Error('no keyring')
    const mnemonic = new TextDecoder().decode(new Uint8Array((await keyrings[0].serialize()).mnemonic))
    const network = EvmNetworks.ethereum_mainnet

    network.rpcUrl = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    const chainProvider = new EvmChainProvider(network)
    const walletOptions = {
      mnemonic: mnemonic,
      // 'diary wolf balcony magnet view mosquito settle gym slim target divert all',
      derivationPath: `m/44'/${network.coinType}'/0'/0/0`,
      network: network
    }

    const walletProvider = new EvmWalletProvider(walletOptions, chainProvider)

    const { method, params } = ctx.req.body
    console.log('method', method, 'params', params)

    // var response: any = ''
    if (method === 'eth_accounts') {
      const accounts = await walletProvider.getSigner().address
      ctx.res.body = [accounts]
    } else if (method === 'eth_chainId') {
      const chainId = await walletProvider.getSigner().getChainId()
      ctx.res.body = chainId
    } else if (method === 'eth_requestAccounts') {
      const accounts = await walletProvider.getSigner().address
      ctx.res.body = [accounts]
    } else if (method === 'eth_getBalance') {
      const balance = await walletProvider.getSigner().getBalance()
      ctx.res.body = balance
    } else if (method == 'personal_sign') {
      // ctx.res.body = await walletProvider.getSigner().signMessage(params[0])
      backgroundMessenger.send('popup_personal_sign', params[0])
      openPopup('/notification')
      backgroundMessenger.on('reply_personal_sign', async ({ data }) => {
        console.log(data, 'signMessage')
        ctx.res.body = await walletProvider.getSigner().signMessage(params[0])
      })
      // console.log(response, 'person')
    }
    // ctx.res.body = response
  }
}
