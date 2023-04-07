import backgroundMessenger from '~/lib.next/messenger/background'
import { unlock, getAccount, autoClosePopup } from '~/middlewares'
import { isUnlocked } from '~/lib.next/keyring'

export const state_isunlock: BackgroundService = {
  method: 'state_isunlock',
  middlewares: [],
  fn: async (ctx, next) => {
    ctx.res.body = await isUnlocked()
  }
}
