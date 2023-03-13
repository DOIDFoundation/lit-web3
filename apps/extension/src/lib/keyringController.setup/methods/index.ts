import { getPermittedAccounts } from './getPermittedAccounts'

// Init methods step by step
export default function setupMethods() {
  // deps: permissionController
  this.getPermittedAccounts = getPermittedAccounts.bind(this)
}
