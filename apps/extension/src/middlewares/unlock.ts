import { openPopup } from '~/lib.next/background/notifier'
import { BACKGROUND_EVENTS, ERR_USER_DENIED } from '~/lib.next/constants'
import backgroundMessenger from '~/lib.next/messenger/background'
import { isUnlocked, getKeyringController } from '~/lib.next/keyring'

const waitingForUnlock: Function[] = []

const waitForUnlock = (resolve: Function) => {
  waitingForUnlock.push(resolve)
  backgroundMessenger.emitter.emit(BACKGROUND_EVENTS.UPDATE_BADGE)
  openPopup()
}

const handleUnlock = async () => {
  if (!waitingForUnlock.length) return
  const err = (await isUnlocked()) ? null : new Error(ERR_USER_DENIED)
  while (waitingForUnlock.length) {
    waitingForUnlock.shift()!(true, err)
  }
  backgroundMessenger.emitter.emit(BACKGROUND_EVENTS.UPDATE_BADGE)
}
backgroundMessenger.emitter.on('unlock', handleUnlock)

// Mostly ignored
backgroundMessenger.emitter.on('popup_closed', handleUnlock)

export const unlock: BackgroundMiddlware = async (ctx, next) => {
  if (await isUnlocked()) return next()
  waitForUnlock(next)
}
