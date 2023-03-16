import { getPermittedAccounts } from './getPermittedAccounts'
import { getProviderNetworkState } from './getProviderNetworkState'
import { getProviderState } from './getProviderState'
import { onEnvironmentTypeClosed } from './onEnvironmentTypeClosed'

// Init methods step by step
export default function setupMethods() {
  // deps: permissionController
  this.getPermittedAccounts = getPermittedAccounts.bind(this)
  // deps: getState/networkController
  this.getProviderNetworkState = getProviderNetworkState.bind(this)
  // deps: isUnlocked/getProviderNetworkState/getPermittedAccounts
  this.getProviderState = getProviderState.bind(this)
  // deps: appStateController/gasFeeController[@TODO: Not Implemented]
  this.onEnvironmentTypeClosed = onEnvironmentTypeClosed.bind(this)
}
