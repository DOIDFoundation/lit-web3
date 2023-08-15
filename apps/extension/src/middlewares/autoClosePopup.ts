import { closePopup } from '~/lib.next/background/notifier'
import { waitingForPopup } from './unlock'

export const autoClosePopup: BackgroundMiddlware = async ({ res, state }, next) => {
  await next()
  res.responder.finally(() => {
    if (waitingForPopup.length) return
    // TODO: not confirmed yet
    // if (!state.passUnlock && res.respond) closePopup()
    if (res.respond) closePopup()
  })
}
