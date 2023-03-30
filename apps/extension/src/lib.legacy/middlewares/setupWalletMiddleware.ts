import { ORIGIN_METAMASK } from '~/constants/app'
import { createScaffoldMiddleware, mergeMiddleware } from 'json-rpc-engine'
import type { JsonRpcMiddleware } from 'json-rpc-engine'
import { providerAsMiddleware, createWalletMiddleware } from 'eth-json-rpc-middleware'

export const setupWalletMiddleware = function () {
  const WalletMiddleware = mergeMiddleware([
    createScaffoldMiddleware({
      eth_syncing: false,
      web3_clientVersion: `DOID/v${'0.0.1'}`
    }),
    createWalletMiddleware({
      // account mgmt
      getAccounts: async ({ origin: innerOrigin }, { suppressUnauthorizedError = true } = <any>{}) => {
        console.log('getacc')
        if (innerOrigin === ORIGIN_METAMASK) {
          const selectedAddress = this.preferencesController.getSelectedAddress()
          return selectedAddress ? [selectedAddress] : []
        } else if (this.isUnlocked()) {
          return await this.getPermittedAccounts(innerOrigin, {
            suppressUnauthorizedError
          })
        }
        return []
      }
      // processTransaction,
      // processEthSignMessage,
      // processTypedMessage,
      // processTypedMessageV3,
      // processTypedMessageV4,
      // processPersonalMessage,
      // processDecryptMessage,
      // processEncryptionPublicKey,
    }) as JsonRpcMiddleware<unknown, unknown>
    // createPendingNonceMiddleware({ getPendingNonce }),
    // createPendingTxMiddleware({ getPendingTransactionByHash }),
  ])
  return WalletMiddleware
}
