import { storedAddress } from '~/lib.next/preferences'

export const getAccount: BackgroundMiddlware = async ({ req, state }, next) => {
  if (req.headers.isInner) {
    state.account = await storedAddress.get()
    return next()
  }
  // TODO: get permitted account
  state.account = await storedAddress.get()
  next()
}
