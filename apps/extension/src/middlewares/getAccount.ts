import { getSelected } from '~/lib.next/keyring'

export const getAccount: BackgroundMiddlware = async ({ req, state }, next) => {
  const DOID = await getSelected()
  console.log(DOID, 'DOID')
  const { name, address } = DOID
  Object.assign(state, { DOID, name, account: address })
  if (req.headers.isInternal) {
    return next()
  }
  // TODO: get permitted account
  next()
}
