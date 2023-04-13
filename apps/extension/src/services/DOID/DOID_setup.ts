// import { bareTLD } from '@lit-web3/ethers/src/nsResolver/checker'
// import { openPopup } from '~/lib.next/background/notifier'
// import { ERR_USER_DENIED } from '~/lib.next/constants'
import backgroundMessenger from '~/lib.next/messenger/background'
import { DOIDBodyParser, yieldPopup, autoClosePopup } from '~/middlewares'

export const DOID_setup: BackgroundService = {
  method: 'DOID_setup',
  middlewares: [DOIDBodyParser(), yieldPopup(`/landing/:DOIDName`), autoClosePopup],
  fn: async ({ req, res }) => {
    // S
    backgroundMessenger.broadcast('DOID_account_change', { bb: 8 })
    // E
    backgroundMessenger.on('reply_DOID_setup', ({ data }) => {
      res.body = data
    })
  }
}
