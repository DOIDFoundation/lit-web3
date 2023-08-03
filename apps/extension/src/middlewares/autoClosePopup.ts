import { closePopup } from '~/lib.next/background/notifier'
import { waitingForPopup } from './unlock'

export const autoClosePopup: BackgroundMiddlware = async ({ res, state }, next) => {
  await next()
  res.responder.finally(() => {
    if (waitingForPopup.length) return
    if (!state.passUnlock && res.respond) closePopup()
  })
}
