import { storedAddress } from '~/lib.next/keyring'

export const getAccount: BackgroundMiddlware = async (ctx, next) => {
  if (ctx.req.headers.isInner) {
    ctx.state.account = await storedAddress.get()
    return next()
  }
  // TODO: get permitted account
  ctx.state.account = await storedAddress.get()
  next()
}
