// import backgroundMessenger from '~/lib.next/messenger/background'
import ipfsHelper from '~/lib.next/ipfsHelper'
import { getKeyringController } from '~/lib.next/keyring'
import backgroundMessenger from '~/lib.next/messenger/background'

export const internal_recovery: BackgroundService = {
  method: 'internal_recovery',
  middlewares: [],
  fn: async (ctx) => {
    const { doid = '', pwd, mnemonic, json = {}, reply = false } = ctx.req.body
    try {
      // 1. save mnemonic
      ;(await getKeyringController()).createNewVaultAndRestore(pwd, mnemonic)
      // 2. save IPNS saveChainAddresses()
      const cid = await ipfsHelper.updateJsonData(json, doid, { memo: mnemonic })
      ctx.res.body = { success: 'ok' }
      if (reply) backgroundMessenger.broadcast('DOID_account_recover', { cid })
    } catch (e) {
      if (reply) backgroundMessenger.broadcast('DOID_account_recover', { err: e })
      throw e
    }
    // backgroundMessenger.on('reply_DOID_setup', ({ data }) => {

    // })
  }
}
