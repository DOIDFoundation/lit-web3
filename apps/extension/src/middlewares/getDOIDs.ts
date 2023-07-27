import { getKeyring } from '~/lib.next/keyring'
import { ERR_METHOD_NOT_ALLOWED } from '~/lib.next/constants'

export const getDOIDs: BackgroundMiddlware = async ({ req, state }, next) => {
  if (!req.headers.isInternal) throw new Error(ERR_METHOD_NOT_ALLOWED)
  const { DOIDs, selectedDOID, isInitialized, isUnlocked } = await getKeyring()
  Object.assign(state, { DOIDs, selectedDOID, isInitialized, isUnlocked })
  next()
}

const DOIDAddressCache: Record<string, string> = {}
export const getMultiChainAddress = (type = undefined): BackgroundMiddlware => {
  return async ({ req, state }, next) => {
    if (!req.headers.isInternal) throw new Error(ERR_METHOD_NOT_ALLOWED)
    state.addresses ??= {}
    const keyring = await getKeyring()
    if (!keyring.isUnlocked) return next()
    let _name: string = req.body?.name ?? (await keyring.selectedDOID).name
    if (DOIDAddressCache.hasOwnProperty(_name)) {
      state.addresses = DOIDAddressCache[_name]
    } else {
      state.addresses = await keyring.getMultiChainAddress(type)
      DOIDAddressCache[_name] = Object.assign({}, state.addresses)
    }
    next()
  }
}
