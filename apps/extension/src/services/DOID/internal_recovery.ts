// import backgroundMessenger from '~/lib.next/messenger/background'
// import ipfsHelper from '~/lib.next/ipfsHelper'
import { getKeyring } from '~/lib.next/keyring'
import backgroundMessenger from '~/lib.next/messenger/background'
import { DOIDBodyParser, popupGoto, autoClosePopup } from '~/middlewares'

export const internal_recovery: BackgroundService = {
  method: 'internal_recovery',
  middlewares: [DOIDBodyParser()],
  fn: async ({ state, req, res }) => {
    // 1. save phrase
    // 2. save IPNS saveChainAddresses()
    const { name, pwd, phrase } = state
    const { json = {}, reply = false, address } = req.body
    try {
      const keyring = await getKeyring()
      if (keyring.DOIDs && name in keyring.DOIDs) throw new Error(`${name} already imported`)

      if (keyring.isInitialized) {
        if (!keyring.isUnlocked) throw new Error('keyring locked')
        await keyring.addDOID(name, phrase)
      } else await keyring.createNewVaultAndRestore(name, pwd, phrase)

      // TODO: move to keyring.setDOIDs
      if (reply) {
        // const { cid, bytes } = await ipfsHelper.updateJsonData(json, name, { memo: phrase })
        // backgroundMessenger.broadcast('reply_DOID_setup', { cid, bytes, address })
        backgroundMessenger.broadcast('reply_DOID_setup', { cid: '', bytes: '', address })
      }
      res.body = 'ok'
    } catch (e) {
      throw e
    }
    // backgroundMessenger.on('reply_DOID_setup', ({ data }) => {

    // })
  }
}
