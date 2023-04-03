import { openPopup } from '~/lib.next/background/notifier'
import { BACKGROUND_EVENTS } from '~/lib.next/constants/events'
import backgroundMessenger from '~/lib.next/messenger/background'
import { getKeyringController } from '~/lib.next/keyring'

const waitingForUnlock: Function[] = []

const waitForUnlock = (resolve: Function) => {
  waitingForUnlock.push(resolve)
  backgroundMessenger.emitter.emit(BACKGROUND_EVENTS.UPDATE_BADGE)
  openPopup()
}

backgroundMessenger.on('popup_closed', () => {
  if (!waitingForUnlock.length) return
  while (waitingForUnlock.length) {
    waitingForUnlock.shift()!(true)
  }
  backgroundMessenger.emitter.emit(BACKGROUND_EVENTS.UPDATE_BADGE)
})

export const unlock: BackgroundMiddlware = async (ctx, next) => {
  const keyringController = await getKeyringController()
  const isUnlocked = keyringController.memStore.getState().isUnlocked
  if (isUnlocked) return next()
  waitForUnlock(next)
}
