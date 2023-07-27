// import backgroundMessenger from '~/lib.next/messenger/background'
import { getKeyring } from '~/lib.next/keyring'
import { requestUnlock } from '~/middlewares/unlock'

export const internal_create_vault: BackgroundService = {
  method: 'internal_create_vault',
  middlewares: [],
  fn: async (ctx) => {
    const { doid = '', pwd, mnemonic } = ctx.req.body
    try {
      const keyringCtrl = await getKeyring()
      await keyringCtrl.createNewVaultAndRestore(doid, pwd, mnemonic)
      // if (doid) res = await keyringCtrl.bindName(doid)
      // await keyringCtrl.setCompletedOnboarding()
      ctx.res.body = 'ok'
      await requestUnlock(`/main`)(ctx)
    } catch (e) {
      throw e
    }
  }
}
