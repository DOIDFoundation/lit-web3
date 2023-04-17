// import backgroundMessenger from '~/lib.next/messenger/background'
import ipfsHelper from '~/lib.next/ipfsHelper'
import { getKeyringController } from '~/lib.next/keyring'
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
      ;(await getKeyringController()).createNewVaultAndRestore(name, pwd, mnemonic)
      await ipfsHelper.updateJsonData(json, name, { memo: mnemonic })
      if (reply) backgroundMessenger.send('DOID_account_update', { mainAddress: true })
      res.body = { success: 'ok' }
    } catch (e) {
      throw e
    }
    // backgroundMessenger.on('reply_DOID_setup', ({ data }) => {

    // })
  }
}
