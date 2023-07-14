import { getKeyring } from '~/lib.next/keyring'
import { ERR_METHOD_NOT_ALLOWED } from '~/lib.next/constants'

export const getDOIDs: BackgroundMiddlware = async ({ req, state }, next) => {
  if (!req.headers.isInternal) throw new Error(ERR_METHOD_NOT_ALLOWED)
  const { DOIDs, selectedDOID, isInitialized, isUnlocked } = await getKeyring()
  Object.assign(state, { DOIDs, selectedDOID, isInitialized, isUnlocked })
  next()
}

const doidAddressCache: Record<string, any> = {}
export const getMultiChainAddress = (type = undefined): BackgroundMiddlware => {
  return async ({ req, state }, next) => {
    if (!req.headers.isInternal) throw new Error(ERR_METHOD_NOT_ALLOWED)
    let addresses: any
    const keyring = await getKeyring()
    let _name: string = req.body?.name ?? (await keyring.selectedDOID).name
    if (doidAddressCache.hasOwnProperty(_name)) {
      addresses = doidAddressCache[_name]
    } else {
      addresses = keyring.getMultiChainAddress(type)
      doidAddressCache[_name] = Object.assign({}, addresses)
    }

    Object.assign(state, { addresses })
    next()
  }
}
