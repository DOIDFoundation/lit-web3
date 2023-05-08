import { closePopup } from '~/lib.next/background/notifier'

export const autoClosePopup: BackgroundMiddlware = async ({ res, state }, next) => {
  await next()
  res.responder.finally(() => {
    if (!state.passOpen && res.respond) closePopup()
  })
}
