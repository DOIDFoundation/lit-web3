import backgroundMessenger from '~/lib.next/messenger/background'
import { getKeyringController, isInitialized, isUnlocked } from '~/lib.next/keyring'

export const state_isunlock: BackgroundService = {
  method: 'state_isunlock',
  middlewares: [],
  fn: async (ctx, next) => {
    ctx.res.body = await isUnlocked()
    backgroundMessenger.log('is unlocked:', ctx.res.body)
  }
}

export const state_isinitialized: BackgroundService = {
  method: 'state_isinitialized',
  middlewares: [],
  fn: async (ctx, next) => {
    ctx.res.body = await isInitialized()
    backgroundMessenger.log('is initialized:', ctx.res.body)
  }
}

export const unlock: BackgroundService = {
  method: 'unlock',
  middlewares: [],
  fn: async (ctx, next) => {
    ctx.res.body = await (await getKeyringController()).submitPassword(ctx.req.raw.data)
  }
}

export const lock: BackgroundService = {
  method: 'lock',
  middlewares: [],
  fn: async (ctx, next) => {
    ctx.res.body = await (await getKeyringController()).setLocked()
  }
}
