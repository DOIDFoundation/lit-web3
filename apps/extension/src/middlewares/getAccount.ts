import { getKeyring } from '~/lib.next/keyring'
import { ConnectsStorage } from '~/lib.next/background/storage/preferences'
import { backgroundToPopup } from '~/lib.next/messenger/background'
import { gotoPopup } from '~/middlewares/unlock'

export const getAccount = (): BackgroundMiddlware => {
  return async (ctx, next) => {
    const { req, state } = ctx
    const { selectedDOID: DOID } = await getKeyring()
    const { name, address } = DOID
    Object.assign(state, { DOID, name, account: address })
    // internal
    if (req.headers.isInternal) return next()
    // inpage need to connect
    await connectAccount()(ctx, next)
  }
}

export const connectAccount = (): BackgroundMiddlware => {
  return async (ctx, next) => {
    const { req } = ctx
    const { origin } = req.headers
    await ConnectsStorage.set('asdasd', origin)
    console.log(await ConnectsStorage.get(origin))
    // gotoPopup('/connect')(ctx,next)
    // backgroundToPopup.send('popup_goto', '/connect')
    // backgroundToPopup.on('connect-change', () => {})
    // next()
  }
}
