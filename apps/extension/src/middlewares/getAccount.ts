import { getKeyring } from '~/lib.next/keyring'
import { ConnectsStorage } from '~/lib.next/background/storage/preferences'
import emitter from '@lit-web3/core/src/emitter'
import { requestUnlock } from './unlock'
import { names2DOIDs } from '~/services/shared'

// >> res.body includes {DOID, name, account}
export const getSelectedAccount = (): BackgroundMiddlware => {
  return async (ctx, next) => {
    const { req, state } = ctx
    const keyring = await getKeyring()
    // internal
    if (req.headers.isInternal) {
      const { selectedDOID: DOID } = keyring
      const { name, address } = DOID
      Object.assign(state, { DOID, name, account: address })
      return next()
    }
    // inpage needs connected account
    await assignConnectedDOIDs()(ctx, next)
  }
}

const fetchConnectedDOIDs = async (host: string) => await names2DOIDs(await ConnectsStorage.get(host))

// For inpage only
// >> res.body includes {DOIDs}
export const assignConnectedDOIDs = ({ passUnlock = false, len = 1 } = {}): BackgroundMiddlware => {
  return async (ctx, next) => {
    const { req, state } = ctx
    if (passUnlock || state.passUnlock) state.passUnlock = passUnlock = true
    state.DOIDs = []
    const { host } = req.headers
    const { isUnlocked } = await getKeyring()

    const getConnects = async () => await ConnectsStorage.get(host)
    let connects = await getConnects()
    const isConnected = () => connects.length
    const assignDOIDs = async () => (state.DOIDs = (await fetchConnectedDOIDs(host)).slice(0, len))

    // No need to unlock
    if (passUnlock) {
      if (isConnected()) await assignDOIDs()
      return next()
    }
    // Already unlocked and connected
    if (isUnlocked && isConnected()) {
      await assignDOIDs()
      return next()
    }

    // Need unlock and not connected yet
    const unlisten = emitter.on('connect_change', async () => {
      await assignDOIDs()
      if (!state.DOIDs.length) return
      unlisten()
      next()
    })
    emitter.once('popup_closed', () => {
      unlisten()
      next()
    })
    await requestUnlock(isConnected() ? undefined : `/connect/${encodeURIComponent(host)}/${state.chain}`)(ctx)
  }
}

export const requestConnectedDOIDs =
  (opts?: any): BackgroundMiddlware =>
  async (ctx, next?) =>
    await new Promise<void>(
      async (_next) =>
        await assignConnectedDOIDs(opts)(ctx, (res: any, err: Error) => {
          if (err) throw err
          _next()
          if (next) next()
        })
    )
