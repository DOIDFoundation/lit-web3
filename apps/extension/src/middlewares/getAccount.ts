import { storedAccount } from '~/lib.next/background/store/preferences'
import { getMemState, getState } from '~/lib.next/keyring'

export const getAccount: BackgroundMiddlware = async ({ req, state }, next) => {
  if (req.headers.isInternal) {
    state.account = await storedAccount.get()
    return next()
  }
  // TODO: get permitted account
  state.account = await storedAccount.get()
  next()
}
