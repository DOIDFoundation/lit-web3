import { openPopup, updatePopup, popupStorage } from '~/lib.next/background/notifier'
import { BACKGROUND_EVENTS, ERR_USER_DENIED } from '~/lib.next/constants'
import { backgroundToPopup } from '~/lib.next/messenger/background'
import { getKeyring } from '~/lib.next/keyring'
import emitter from '@lit-web3/core/src/emitter'

const waitingQueue: Function[] = []
const userDenied = new Error(ERR_USER_DENIED)

const handlePopup = (err?: Error) => {
  if (!waitingQueue.length) return
  while (waitingQueue.length) {
    waitingQueue.shift()!(err)
  }
  emitter.emit(BACKGROUND_EVENTS.UPDATE_BADGE)
}
emitter.on('unlock', () => handlePopup())
// Mostly ignored
emitter.on('popup_closed', () => handlePopup(userDenied))

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
export const unlock = (url?: string): BackgroundMiddlware => popupGoto({ url, unlock: true })

export const popupGoto = ({ url = '', unlock = false } = {}): BackgroundMiddlware => {
  return async ({ req, res, state }, next) => {
    await new Promise(async (resolve, reject) => {
      const { isInitialized, isUnlocked } = await getKeyring()
      const needUnlock = (state.needUnlock = unlock ? !isUnlocked : undefined)
      const dest = url ? state2url(state, url) : needUnlock ? '/idle' : '/'
      const redirectUrl = needUnlock ? (isInitialized ? `/unlock/${encodeURIComponent(dest)}` : '/import') : dest
      // internal
      if (req.headers.isInternal) return resolve(backgroundToPopup.send('popup_goto', dest))
      if (!url && popupStorage.isOpen) state.passOpen = true
      // Already unlocked
      if (needUnlock === false) {
        if (url) await updatePopup(url)
        return resolve(true)
      }
      // Waiting for unlock
      const _next = async (err?: Error) => {
        if (err) return reject(userDenied)
        const { isUnlocked: unlocked } = await getKeyring()
        if (needUnlock !== undefined) return unlocked ? resolve(unlocked) : reject(userDenied)
        resolve(await updatePopup(dest))
      }
      if (!popupStorage.isOpen) waitingQueue.push(_next)
      emitter.emit(BACKGROUND_EVENTS.UPDATE_BADGE)
      await openPopup(redirectUrl)
    })
    next()
  }
}
