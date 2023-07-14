import type {
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName
} from '@aptos-labs/wallet-adapter-core'

import { AptosAccount, AptosClient } from 'aptos'

import { getAptosProvider } from './daemon'

import { getKeyring } from '~/lib.next/keyring'

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
    let phrase = ''
    try {
      const keyring = await getKeyring()
      phrase = keyring.phrase
    } catch (err) {
      throw err
    }

    const walletOptions = {
      mnemonic: phrase,
      derivationPath: `m/44'/637'/0'/0'/0'`
    }
    const provider = getAptosProvider()

    const { method, params } = ctx.req.body
    console.log('method', method, 'params', params)

    var response: any = ''
    if (method === 'connect') {
      let apt = AptosAccount.fromDerivePath(walletOptions.derivationPath, walletOptions.mnemonic)
      const accounts = apt.address().hex()
      const info = { address: accounts, publicKey: apt.pubKey().hex() }
      response = info
    } else if (method === 'disconnect') {
    } else if (method === 'isConnected') {
    } else if (method === 'getAccount') {
    } else if (method === 'network') {
      const name = 'devnet'
      response = name
      // {
      //   name,
      //   chainId: 'TESTING',
      //   url: 'https://fullnode.devnet.aptoslabs.com/v1'
      // }
    } else if (method === 'signAndSubmitTransaction') {
    } else if (method === 'signMessage') {
      let account = AptosAccount.fromDerivePath(walletOptions.derivationPath, walletOptions.mnemonic)
      let sign = account.signHexString(stringToHex(params.message))
      response = {
        address: account.address().hex(),
        fullMessage: params.message,
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
