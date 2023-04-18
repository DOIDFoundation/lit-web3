import { storedAddress } from '~/lib.next/preferences'
import { getMemState, getState } from '~/lib.next/keyring'

export const getAccount: BackgroundMiddlware = async ({ req, state }, next) => {
  if (req.headers.isInternal) {
    state.account = await storedAddress.get()
    return next()
  }
  // TODO: get permitted account
  state.account = await storedAddress.get()
  next()
}
