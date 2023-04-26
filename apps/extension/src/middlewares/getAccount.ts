import { getKeyring } from '~/lib.next/keyring'
import { ConnectsStorage } from '~/lib.next/background/storage/preferences'
import { popupGoto } from '~/middlewares/unlock'
import emitter from '@lit-web3/core/src/emitter'

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
    const { origin } = ctx.req.headers
    const connected = await ConnectsStorage.has(origin)
    if (connected) return next()
    await new Promise((_next) => {
      popupGoto(`/connect/${encodeURIComponent(origin)}`)(ctx, _next)
    })
    emitter.on('connect_change', async (e: CustomEvent) => {
      const { origin: _origin, has } = e.detail
      if (has && _origin === origin) return next()
    })
  }
}
