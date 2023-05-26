import { getKeyring } from '~/lib.next/keyring'
import { ConnectsStorage } from '~/lib.next/background/storage/preferences'
import { popupGoto } from '~/middlewares/unlock'
import emitter from '@lit-web3/core/src/emitter'
import { ERR_USER_DENIED } from '~/lib.next/constants'

export const getAccount = (): BackgroundMiddlware => {
  return async (ctx, next) => {
    const { req, state } = ctx
    const [chain] = req.body
    const { selectedDOID: DOID } = await getKeyring()
    const { name, address } = DOID
    Object.assign(state, { DOID, name, account: address })
    // internal
    if (req.headers.isInternal) return next()
    // inpage need to connect
    await connectAccount(chain, name)(ctx, next)
  }
}

export const connectAccount = (_chain?: string, name?: string): BackgroundMiddlware => {
  return async (ctx, next) => {
    const chain = _chain ?? 'ethereum'
    const { origin } = ctx.req.headers
    const connected = await ConnectsStorage.has(`${origin}-${chain}`, name)
    if (connected) return next()
    const unlisten = emitter.on('connect_change', async (e: CustomEvent) => {
      const { origin: _origin, has } = e.detail
      if (has && _origin === origin) return next()
    })
    emitter.on('popup_closed', () => {
      ctx.res.err = new Error(ERR_USER_DENIED)
      unlisten()
    })
    await new Promise(async (_next) => {
      await popupGoto({ path: `/connect/${encodeURIComponent(origin)}/${chain}` })(ctx, _next)
    })
  }
}
