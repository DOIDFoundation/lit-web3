import { openPopup, updatePopup } from '~/lib.next/background/notifier'
import { BACKGROUND_EVENTS, ERR_USER_DENIED } from '~/lib.next/constants'
import { backgroundToPopup } from '~/lib.next/messenger/background'
import { getKeyring } from '~/lib.next/keyring'
import emitter from '@lit-web3/core/src/emitter'

export const waitingForPopup: { ctx: BackgroundMiddlwareCtx; next: Function }[] = []
const userDenied = new Error(ERR_USER_DENIED)

const handlePopup = async (err?: Error) => {
  if (!waitingForPopup.length) return
  if (err) {
    while (waitingForPopup.length) await waitingForPopup.shift()!.next(err)
  } else {
    await Promise.all(
      waitingForPopup.map(async ({ ctx, next }, i) => {
        next()
        try {
          await ctx.res.responder
        } catch {}
        waitingForPopup.splice(i, 1)
      })
    )
  }
  emitter.emit(BACKGROUND_EVENTS.UPDATE_BADGE)
}
emitter.on('unlock', () => handlePopup())
// Mostly ignored
emitter.on('popup_closed', () => handlePopup(userDenied))

// eg. /landing/:DOIDName + req.state.DOIDName >> /landing/vitalik
// TODO: [Watch this](https://github.com/WICG/urlpattern/issues/73)
export const state2path = (state: Record<string, any>, path = '') => {
  return path.replaceAll(/(\/:)(\w+)/g, (_, _slash, key) => {
    const val = state[key]
    if (val) {
      if (typeof val !== 'string') throw new Error(`Invalid route path: ${path}`)
    } else throw new Error(`req.state[${key}] not found`)
    return `/${val}`
  })
}

// Auth requests (in middleware chain, eg: `middlewares: [unlock()]`)
export const unlock = (path?: string): BackgroundMiddlware => {
  console.warn('Deprecated. Please use requestUnlock() instead')
  return popupGoto({ path, unlock: true })
}

// Auth requests (in middlerware chain or manual await, eg: `await requestUnlock(path)(ctx)`)
export const requestUnlock =
  (path?: string): BackgroundMiddlware =>
  async (ctx, next?) =>
    await new Promise<void>(
      async (_next) =>
        await popupGoto({ path, unlock: true })(ctx, (res: any, err: Error) => {
          if (err) throw err
          _next()
          if (next) next()
        })
    )

export const popupGoto = ({ path = '', unlock = false } = {}): BackgroundMiddlware => {
  return async (ctx, next) => {
    const { req, state } = ctx
    await new Promise(async (resolve, reject) => {
      const { isInitialized, isUnlocked } = await getKeyring()
      const needUnlock = (state.needUnlock = unlock ? !isUnlocked : undefined)
      const dest = path ? state2path(state, path) : needUnlock ? '/idle' : '/'
      const redirectDest = needUnlock ? (isInitialized ? `/unlock/${encodeURIComponent(dest)}` : '/') : dest
      // Pass internal
      if (req.headers.isInternal) return resolve(backgroundToPopup.send('popup_goto', dest))
      const goto = async () => resolve(path && (await updatePopup(dest)))
      // Already unlocked
      if (needUnlock === false) return await goto()
      // Waiting for popup open
      const _next = async (err?: Error) => {
        if (err) return reject(userDenied)
        const { isUnlocked: unlocked } = await getKeyring()
        if (needUnlock !== undefined) return unlocked ? resolve(unlocked) : reject(userDenied)
        await goto()
      }
      waitingForPopup.push({ ctx, next: _next })
      emitter.emit(BACKGROUND_EVENTS.UPDATE_BADGE)
      await openPopup(redirectDest)
    })
    next()
  }
}
