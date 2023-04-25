// import backgroundMessenger from '~/lib.next/messenger/background'
import ipfsHelper from '~/lib.next/ipfsHelper'
import { getKeyring } from '~/lib.next/keyring'
import backgroundMessenger from '~/lib.next/messenger/background'
import { DOIDBodyParser, gotoPopup, autoClosePopup } from '~/middlewares'

export const internal_recovery: BackgroundService = {
  method: 'internal_recovery',
  middlewares: [DOIDBodyParser()],
  fn: async ({ state, req, res }) => {
    // 1. save mnemonic
    // 2. save IPNS saveChainAddresses()
    console.log('11111111')
    const { name, pwd, mnemonic } = state
    const { json = {}, reply = false } = req.body
    try {
      ;(await getKeyring()).createNewVaultAndRestore(name, pwd, mnemonic)
      // TODO: move to keyring.setDOIDs
      const cid = await ipfsHelper.updateJsonData(json, name, { memo: mnemonic })
      if (reply) backgroundMessenger.broadcast('DOID_account_update', { cid })
      res.body = { success: 'ok' }
    } catch (e) {
      throw e
    }
    // backgroundMessenger.on('reply_DOID_setup', ({ data }) => {

    // })
  }
}
