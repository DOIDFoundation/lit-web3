import { closePopup } from '~/lib.next/background/notifier'

export const autoClosePopup: BackgroundMiddlware = async (ctx, next) => {
  await next()
  ctx.res.responder.finally(() => {
    if (ctx.res.respond) closePopup()
  })
}
