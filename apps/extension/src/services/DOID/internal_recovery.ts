// import backgroundMessenger from '~/lib.next/messenger/background'
import ipfsHelper from '~/lib.next/ipfsHelper'
import { getKeyring } from '~/lib.next/keyring'
import backgroundMessenger from '~/lib.next/messenger/background'
import { DOIDBodyParser, yieldPopup, autoClosePopup } from '~/middlewares'

export const internal_create: BackgroundService = {
  method: 'internal_recovery',
  middlewares: [DOIDBodyParser()],
  fn: async ({ state, req, res }) => {
    // 1. save mnemonic
    // 2. save IPNS saveChainAddresses()
    const { name, pwd, mnemonic } = state
    const { json = {}, reply = false } = req.body
    try {
      ;(await getKeyring()).createNewVaultAndRestore(name, pwd, mnemonic)
      const cid = await ipfsHelper.updateJsonData(json, name, { memo: mnemonic })
      res.body = { success: 'ok' }
      if (reply) backgroundMessenger.send('DOID_account_update', { cid })
    } catch (e) {
      throw e
    }
    // backgroundMessenger.on('reply_DOID_setup', ({ data }) => {

    // })
  }
}
