import { openPopup } from '~/lib.next/background/notifier'
import { BACKGROUND_EVENTS, ERR_USER_DENIED } from '~/lib.next/constants'
import backgroundMessenger from '~/lib.next/messenger/background'
import { isUnlocked, getKeyringController } from '~/lib.next/keyring'

const waitingForUnlock: Function[] = []
const waitingForYieldPopup: BackgroundMiddlwareCtx[] = []

const handleUnlock = async () => {
  if (!waitingForUnlock.length) return
  const err = (await isUnlocked()) ? null : new Error(ERR_USER_DENIED)
  while (waitingForUnlock.length) {
    waitingForUnlock.shift()!(true, err)
  }
  backgroundMessenger.emitter.emit(BACKGROUND_EVENTS.UPDATE_BADGE)
}
const onYieldPopupClosed = () => {
  if (!waitingForYieldPopup.length) return
  while (waitingForYieldPopup.length) {
    let { res } = waitingForYieldPopup.shift()!
    if (!res.respond) res.err = new Error(ERR_USER_DENIED)
  }
}

backgroundMessenger.emitter.on('unlock', handleUnlock)
// Mostly ignored
backgroundMessenger.emitter.on('popup_closed', () => {
  handleUnlock()
  onYieldPopupClosed()
})

// eg. /landing/:DOIDName + req.state.DOIDName >> /landing/vitalik
export const state2url = (state: Record<string, any>, url?: string) => {
  if (!url) return
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
      const _next = (_?: any, err?: any) => {
        if (err) return reject(err)
        resolve(next())
        if (popupUrl) backgroundMessenger.send('popup_goto', state2url(state, popupUrl))
      }
      if (await isUnlocked()) return _next()
      waitingForUnlock.push(_next)
      backgroundMessenger.emitter.emit(BACKGROUND_EVENTS.UPDATE_BADGE)
      openPopup('/unlock')
    })
  }
}

// Non-Authed requests
export const yieldPopup = (popupUrl?: string): BackgroundMiddlware => {
  return async (ctx, next) => {
    waitingForYieldPopup.push(ctx)
    openPopup(state2url(ctx.state, popupUrl))
    return next()
  }
}
