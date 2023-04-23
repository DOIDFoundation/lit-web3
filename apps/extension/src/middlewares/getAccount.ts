import { getKeyring } from '~/lib.next/keyring'

export const getAccount: BackgroundMiddlware = async ({ req, state }, next) => {
  const { selectedDOID: DOID } = await getKeyring()
  const { name, address } = DOID
  Object.assign(state, { DOID, name, account: address })
  if (req.headers.isInternal) {
    return next()
  }
  // TODO: get permitted account
  next()
}
