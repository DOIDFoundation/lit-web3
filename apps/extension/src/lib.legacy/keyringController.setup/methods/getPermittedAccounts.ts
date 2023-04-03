import { RestrictedMethods } from '~/constants/permissions'
import { errorCodes as rpcErrorCodes } from 'eth-rpc-errors'
// deps: permissionController
export const getPermittedAccounts = async function (origin, { suppressUnauthorizedError = true } = {}) {
  try {
    return await this.permissionController.executeRestrictedMethod(origin, RestrictedMethods.eth_accounts)
  } catch (error) {
    if (suppressUnauthorizedError && error.code === rpcErrorCodes.provider.unauthorized) {
      return []
    }
    throw error
  }
}
