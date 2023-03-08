export { createDupeReqFilterMiddleware } from './createDupeReqFilterMiddleware'
export { createOriginMiddleware } from './createOriginMiddleware'
export { createTabIdMiddleware } from './createTabIdMiddleware'
export { createLoggerMiddleware } from './createLoggerMiddleware'
export { default as createRPCMethodTrackingMiddleware } from './createRPCMethodTrackingMiddleware'
export { createOnboardingMiddleware } from './createOnboardingMiddleware'
export {
  createMethodMiddleware
  ///: BEGIN:ONLY_INCLUDE_IN(flask)
  // createSnapMethodMiddleware
  ///: END:ONLY_INCLUDE_IN
} from './rpc-method-middleware'

import { providerAsMiddleware, createWalletMiddleware } from 'eth-json-rpc-middleware'
import { createScaffoldMiddleware, mergeMiddleware } from 'json-rpc-engine'
import type { JsonRpcMiddleware } from 'json-rpc-engine'

export const createDOIDMiddleware = function (
  {
    version,
    getAccounts
    // processTransaction,
    // processEthSignMessage,
    // processTypedMessage,
    // processTypedMessageV3,
    // processTypedMessageV4,
    // processPersonalMessage,
    // processDecryptMessage,
    // processEncryptionPublicKey,
    // getPendingNonce,
    // getPendingTransactionByHash,
  } = <any>{}
) {
  const metamaskMiddleware = mergeMiddleware([
    createScaffoldMiddleware({
      eth_syncing: false,
      web3_clientVersion: `DOID/v${version}`
    }),
    createWalletMiddleware({
      getAccounts
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
  return metamaskMiddleware
}
