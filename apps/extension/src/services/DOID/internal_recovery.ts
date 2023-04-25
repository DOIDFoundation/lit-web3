// import backgroundMessenger from '~/lib.next/messenger/background'
import ipfsHelper from '~/lib.next/ipfsHelper'
import { getKeyring } from '~/lib.next/keyring'
import backgroundMessenger from '~/lib.next/messenger/background'
import { DOIDBodyParser, yieldPopup, autoClosePopup } from '~/middlewares'

export const internal_recovery: BackgroundService = {
  method: 'internal_recovery',
  middlewares: [DOIDBodyParser()],
  fn: async ({ state, req, res }) => {
    // 1. save mnemonic
    // 2. save IPNS saveChainAddresses()
    const { name, pwd, mnemonic } = state
    const { json = {}, reply = false, address } = req.body
    try {
      ;(await getKeyring()).createNewVaultAndRestore(name, pwd, mnemonic)
      const { cid, bytes } = await ipfsHelper.updateJsonData(json, name, { memo: mnemonic })
      if (reply) {
        backgroundMessenger.broadcast('reply_DOID_setup', { cid, bytes, address })
      }
      res.body = 'ok'
    } catch (e) {
      throw e
    }
  }
}
