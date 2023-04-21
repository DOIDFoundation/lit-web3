import { getKeyring } from '~/lib.next/keyring'
import { ERR_METHOD_NOT_ALLOWED } from '~/lib.next/constants'

export const getDOIDs: BackgroundMiddlware = async ({ req, state }, next) => {
  if (!req.headers.isInternal) throw new Error(ERR_METHOD_NOT_ALLOWED)
  const { DOIDs, selectedDOID, isInitialized, isUnlocked } = await getKeyring()
  Object.assign(state, { DOIDs, selectedDOID, isInitialized, isUnlocked })
  next()
}
