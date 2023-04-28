import { AptosAccount, AptosClient } from 'aptos'
import type {
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName
} from '@aptos-labs/wallet-adapter-core'

import { Provider, Network } from 'aptos'

function stringToHex(str: string): string {
  let hex = ''
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i).toString(16)
    hex += charCode.length < 2 ? '0' + charCode : charCode
  }
  return hex
}

export const APTOS_request: BackgroundService = {
  method: 'aptos_request',
  allowInpage: true,
  middlewares: [],

  fn: async (ctx) => {
    const walletOptions = {
      mnemonic: 'diary wolf balcony magnet view mosquito settle gym slim target divert all',
      derivationPath: `m/44'/637'/0'/0'/0'`
    }
    const NODE_URL = process.env.APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com'
    const client = new AptosClient(NODE_URL)
    const provider = new Provider(Network.DEVNET, { BASE: 'https://fullnode.devnet.aptoslabs.com/v1' })

    const { method, params } = ctx.req.body
    console.log('method', method, 'params', params)

    var response: any = ''
    if (method === 'connect') {
      let apt = AptosAccount.fromDerivePath(`m/44'/637'/0'/0'/0'`, walletOptions.mnemonic)
      const accounts = apt.address().hex()
      const info = { address: accounts, publicKey: apt.pubKey }
      response = info
    } else if (method === 'disconnect') {
    } else if (method === 'isConnected') {
    } else if (method === 'getAccount') {
    } else if (method === 'network') {
      // const chainId = await client.getChainId()
      const name = provider.network

      response = {
        name,
        chainId: 'TESTING',
        url: NODE_URL
      }
    } else if (method === 'signAndSubmitTransaction') {
    } else if (method === 'signMessage') {
      let account = AptosAccount.fromDerivePath(`m/44'/637'/0'/0'/0'`, walletOptions.mnemonic)
      let sign = account.signHexString(stringToHex(params.message))
      response = {
        address: account.address().hex(),
        fullMessage: sign.hex(),
        message: params.message,
        nonce: params.nonce,
        prefix: 'APTOS',
        signature: sign.hex()
      }
    }

    console.info('method:', method, 'response:', response)
    ctx.res.body = response
  }
}
