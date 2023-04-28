// Inpage Provider
import { inpageLogger } from '~/lib.next/logger'
import inpageMessenger from '~/lib.next/messenger/inpage'
import { AptosWalletErrorResult, NetworkName, PluginProvider } from '@aptos-labs/wallet-adapter-core'
import type {
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName
} from '@aptos-labs/wallet-adapter-core'
import { Types } from 'aptos'
import { icon } from '@lit-web3/solana-wallet-standard/src/icon'

export const inpageProvider = () => {
  return {
    request: async ({ method, params } = <Record<string, any>>{}) => {
      inpageLogger('requested', method, params)
      const res = await inpageMessenger.send('aptos_request', { method, params })
      inpageLogger('response', res)
      return res
    },
    on: inpageMessenger.on
  }
}

interface AptosWindow extends Window {
  aptos?: PluginProvider
}

declare const window: AptosWindow

export const AptosWalletName = 'DoidAptos' as WalletName<'DoidAptos'>

export class AptosWallet implements AdapterPlugin {
  readonly name = AptosWalletName
  readonly url = ''
  readonly icon = icon

  readonly providerName = 'doid'

  provider: PluginProvider | undefined = typeof window !== 'undefined' ? window.aptos : undefined // CHANGE window.aptos

  async connect(): Promise<AccountInfo> {
    try {
      const res = await inpageMessenger.send('aptos_request', { method: 'connect' })
      return res
    } catch (error: any) {
      throw error
    }
  }

  async account(): Promise<AccountInfo> {
    try {
      const res = await inpageMessenger.send('aptos_request', { method: 'connect' })
      return res
    } catch (error: any) {
      throw error
    }
  }

  async disconnect(): Promise<void> {
    try {
      // await this.provider?.disconnect()
      throw new Error('disconnect not implement')
    } catch (error: any) {
      throw error
    }
  }

  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    // try {
    //   const response = await this.provider?.signAndSubmitTransaction(transaction, options)
    //   if ((response as AptosWalletErrorResult).code) {
    //     throw new Error((response as AptosWalletErrorResult).message)
    //   }
    //   return response as { hash: Types.HexEncodedBytes }
    // } catch (error: any) {
    //   const errMsg = error.message
    //   throw errMsg
    // }

    try {
      throw new Error('signAndSubmitTransaction not implement')
    } catch (error: any) {
      throw error
    }
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    const res = await inpageMessenger.send('aptos_request', { method: 'signMessage', params: message })
    return res
  }

  async network(): Promise<NetworkInfo> {
    try {
      const res = await inpageMessenger.send('aptos_request', { method: 'network' })
      return res
    } catch (error: any) {
      throw error
    }
  }

  async onNetworkChange(callback: any): Promise<void> {
    // try {
    //   const handleNetworkChange = async (newNetwork: { networkName: NetworkInfo }): Promise<void> => {
    //     callback({
    //       name: newNetwork.networkName,
    //       chainId: undefined,
    //       api: undefined
    //     })
    //   }
    //   await this.provider?.onNetworkChange(handleNetworkChange)
    // } catch (error: any) {
    //   const errMsg = error.message
    //   throw errMsg
    // }
    // try {
    //   throw new Error('onNetworkChange not implement')
    // } catch (error: any) {
    //   throw error
    // }
  }

  async onAccountChange(callback: any): Promise<void> {
    // try {
    //   const handleAccountChange = async (newAccount: AccountInfo): Promise<void> => {
    //     if (newAccount?.publicKey) {
    //       callback({
    //         publicKey: newAccount.publicKey,
    //         address: newAccount.address
    //       })
    //     } else {
    //       const response = await this.connect()
    //       callback({
    //         address: response?.address,
    //         publicKey: response?.publicKey
    //       })
    //     }
    //   }
    //   await this.provider?.onAccountChange(handleAccountChange)
    // } catch (error: any) {
    //   console.log(error)
    //   const errMsg = error.message
    //   throw errMsg
    // }
    // try {
    //   throw new Error('onAccountChange not implement')
    // } catch (error: any) {
    //   throw error
    // }
  }
}

export const injectAptosInpageProvider = () => {
  if (!('aptos' in window)) {
    try {
      // window.aptos = inpageProvider()
      window.petra = new AptosWallet()
      window.aptos = window.petra
      // new dispatchEvent(new Event('aptos#initialized'))
      inpageLogger('injected-aptos')
    } catch (error) {
      console.log(error)
    }
  }
}
