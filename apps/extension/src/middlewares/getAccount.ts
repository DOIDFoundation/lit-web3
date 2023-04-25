import { getKeyring } from '~/lib.next/keyring'

export const getAccount = (): BackgroundMiddlware => {
  return async (ctx, next) => {
    const { req, state } = ctx
    const { selectedDOID: DOID } = await getKeyring()
    const { name, address } = DOID
    Object.assign(state, { DOID, name, account: address })
    // internal
    if (req.headers.isInternal) return next()
    // inpage
    await connectAccount()(ctx, next)
  }
}

export const connectAccount = (): BackgroundMiddlware => {
  return async ({ req, state }, next) => {
    console.log(req)
    // const { selectedDOID, DOIDs } = await getKeyring()
    // Object.assign(state, { DOID, name, account: address })
    // if (req.headers.isInternal) {
    //   return next()
    // }
    // TODO: get permitted account
    // next()
  }
}
