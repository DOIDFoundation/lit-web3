// import backgroundMessenger from '~/lib.next/messenger/background'
import ipfsHelper from '~/lib.next/ipfsHelper'
import { getKeyringController } from '~/lib.next/keyring'
import backgroundMessenger from '~/lib.next/messenger/background'

export const internal_create: BackgroundService = {
  method: 'internal_recovery',
  middlewares: [],
  fn: async (ctx) => {
    // 1. save mnemonic
    // 2. save IPNS saveChainAddresses()
    const { doid = '', pwd, mnemonic, json = {}, reply = false } = ctx.req.body
    try {
      ;(await getKeyringController()).createNewVaultAndRestore(pwd, mnemonic)
      await ipfsHelper.updateJsonData(json, doid, { memo: mnemonic })
      if (reply) backgroundMessenger.send('DOID_account_update', { mainAddress: true })
      ctx.res.body = { success: 'ok' }
    } catch (e) {
      throw e
    }
    // backgroundMessenger.on('reply_DOID_setup', ({ data }) => {

    // })
  }
}
