import { JsonRpcEngine } from 'json-rpc-engine'
import * as Middlewares from '../middlewares'
import { SubjectType } from '@metamask/subject-metadata-controller'
import { providerAsMiddleware } from '@metamask/eth-json-rpc-middleware'

declare interface engineOpts {
  origin: string
  subjectType: string
  sender: Sender
  tabId: any
}
export const setupProviderEngine = function ({ origin, subjectType, sender, tabId } = <engineOpts>{}) {
  const { provider } = this
  const engine = new JsonRpcEngine()
  // forward notifications from network provider
  provider.on('data', (error: any, message: any) => {
    console.log('engine on data')
    if (error) throw error
    engine.emit('notification', message)
  })
  engine.push(Middlewares.createDupeReqFilterMiddleware())
  // append origin to each request
  engine.push(Middlewares.createOriginMiddleware({ origin }))
  // append tabId to each request if it exists
  if (tabId) {
    engine.push(Middlewares.createTabIdMiddleware({ tabId }))
  }
  // logging
  engine.push(Middlewares.createLoggerMiddleware({ origin }))
  // engine.push(this.permissionLogController.createMiddleware())
  // engine.push(
  //   Middlewares.createRPCMethodTrackingMiddleware({
  //     trackEvent: this.metaMetricsController.trackEvent.bind(this.metaMetricsController),
  //     getMetricsState: this.metaMetricsController.store.getState.bind(this.metaMetricsController.store)
  //   })
  // )

  // onboarding
  if (subjectType === SubjectType.Website) {
    engine.push(
      Middlewares.createOnboardingMiddleware({
        location: sender.url,
        registerOnboarding: this.onboardingController.registerOnboarding
      })
    )
  }

  // Unrestricted/permissionless RPC method implementations
  engine.push(
    Middlewares.createMethodMiddleware({
      origin,
      subjectType,

      // Miscellaneous
      addSubjectMetadata: this.subjectMetadataController.addSubjectMetadata.bind(this.subjectMetadataController),
      getProviderState: this.getProviderState.bind(this),
      getUnlockPromise: this.appStateController.getUnlockPromise.bind(this.appStateController),
      // handleWatchAssetRequest: this.tokensController.watchAsset.bind(this.tokensController),
      requestUserApproval: this.approvalController.addAndShowApprovalRequest.bind(this.approvalController),
      // sendMetrics: this.metaMetricsController.trackEvent.bind(this.metaMetricsController),

      // Permission-related
      getAccounts: this.getPermittedAccounts.bind(this, origin),
      getPermissionsForOrigin: this.permissionController.getPermissions.bind(this.permissionController, origin),
      hasPermission: this.permissionController.hasPermission.bind(this.permissionController, origin),
      requestAccountsPermission: this.permissionController.requestPermissions.bind(
        this.permissionController,
        { origin },
        { eth_accounts: {} }
      ),
      requestPermissionsForOrigin: this.permissionController.requestPermissions.bind(this.permissionController, {
        origin
      }),

      // Custom RPC-related
      addCustomRpc: async ({ chainId, blockExplorerUrl, ticker, chainName, rpcUrl } = {}) => {
        await this.preferencesController.upsertToFrequentRpcList(rpcUrl, chainId, ticker, chainName, {
          blockExplorerUrl
        })
      },
      // findCustomRpcBy: this.findCustomRpcBy.bind(this),
      getCurrentChainId: () => this.networkController.store.getState().provider.chainId,
      getCurrentRpcUrl: this.networkController.store.getState().provider.rpcUrl,
      setProviderType: this.networkController.setProviderType.bind(this.networkController),
      updateRpcTarget: ({ rpcUrl, chainId, ticker, nickname }) => {
        this.networkController.setRpcTarget(rpcUrl, chainId, ticker, nickname)
      }
    })
  )

  if (subjectType !== SubjectType.Internal) {
    // permissions
    engine.push(
      this.permissionController.createPermissionMiddleware({
        origin
      })
    )
  }

  engine.push(this.walletMiddleware)
  // DOIDs
  // engine.push(
  //   Middlewares.createDOIDSetupMiddleware({
  //     origin,
  //     getAccounts: this.getPermittedAccounts.bind(this, origin),
  //     getUnlockPromise: this.appStateController.getUnlockPromise.bind(this.appStateController)
  //   })
  // )

  // forward to metamask primary provider
  engine.push(providerAsMiddleware(provider))
  return engine
}
