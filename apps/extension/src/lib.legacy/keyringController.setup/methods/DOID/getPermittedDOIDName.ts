import { RestrictedMethods } from '~/constants/permissions'
import { errorCodes as rpcErrorCodes } from 'eth-rpc-errors'
// deps: permissionController
export const getPermittedDOIDName = async function (origin, { suppressUnauthorizedError = true } = {}) {
  try {
    return await this.keyringController.getAccounts()
  } catch (error) {
    if (suppressUnauthorizedError && error.code === rpcErrorCodes.provider.unauthorized) {
      return []
    }
    throw error
  }
}
