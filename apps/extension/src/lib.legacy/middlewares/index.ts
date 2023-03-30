export { createDupeReqFilterMiddleware } from './createDupeReqFilterMiddleware'
export { createOriginMiddleware } from './createOriginMiddleware'
export { createTabIdMiddleware } from './createTabIdMiddleware'
export { createLoggerMiddleware } from './createLoggerMiddleware'
export { default as createRPCMethodTrackingMiddleware } from './createRPCMethodTrackingMiddleware'
export { createOnboardingMiddleware } from './createOnboardingMiddleware'
export { createMethodMiddleware } from './rpc-method-middleware'
export * from './DOID'
import { setupWalletMiddleware } from './setupWalletMiddleware'

export default function setupMiddlewares() {
  // deps: preferencesController/isUnlocked/getPermittedAccounts
  this.walletMiddleware = setupWalletMiddleware.bind(this)()
}
