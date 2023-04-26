import { openPopup } from '~/lib.next/background/notifier'
import { BACKGROUND_EVENTS, ERR_USER_DENIED } from '~/lib.next/constants'
import { backgroundToPopup } from '~/lib.next/messenger/background'
import { getKeyring } from '~/lib.next/keyring'

const waitingForUnlock: Function[] = []
const waitingForPopupGoto: BackgroundMiddlwareCtx[] = []

const handleUnlock = async () => {
  if (!waitingForUnlock.length) return
  const err = (await getKeyring()).isUnlocked ? null : new Error(ERR_USER_DENIED)
  while (waitingForUnlock.length) {
    waitingForUnlock.shift()!(true, err)
  }
  backgroundToPopup.emitter.emit(BACKGROUND_EVENTS.UPDATE_BADGE)
}
const onPopupGotoClosed = () => {
  if (!waitingForPopupGoto.length) return
  while (waitingForPopupGoto.length) {
    let { res } = waitingForPopupGoto.shift()!
    if (!res.respond) res.err = new Error(ERR_USER_DENIED)
  }
}

backgroundToPopup.emitter.on('unlock', handleUnlock)
// Mostly ignored
backgroundToPopup.emitter.on('popup_closed', () => {
  handleUnlock()
  onPopupGotoClosed()
})

// eg. /landing/:DOIDName + req.state.DOIDName >> /landing/vitalik
export const state2url = (state: Record<string, any>, url = '') => {
  return url.replaceAll(/(\/:)(\w+)/g, (_, _slash, key) => {
    const val = state[key]
    if (val) {
      if (typeof val !== 'string') throw new Error(`Invalid route path: ${url}`)
    } else throw new Error(`req.state[${key}] not found`)
    return `/${val}`
  })
}

// Authed requests
export const unlock = (popupUrl?: string): BackgroundMiddlware => {
  return async ({ state }, next) => {
    await new Promise(async (resolve, reject) => {
      const { isInitialized, isUnlocked } = await getKeyring()
      const dest = popupUrl ? state2url(state, popupUrl) : '/idle'
      const _next = async (_?: any, err?: any) => {
        if (err) return reject(err)
        backgroundToPopup.send('popup_goto', dest)
        resolve(next())
      }
      if (isUnlocked) return _next()
      waitingForUnlock.push(_next)
      backgroundToPopup.emitter.emit(BACKGROUND_EVENTS.UPDATE_BADGE)
      await openPopup(isInitialized ? `/unlock/${encodeURIComponent(dest)}` : dest)
    })
  }
}

// Non-Authed requests
export const popupGoto = (popupUrl = '/'): BackgroundMiddlware => {
  return async (ctx, next) => {
    waitingForPopupGoto.push(ctx)
    await openPopup(state2url(ctx.state, popupUrl))
    return next()
  }
}
