import { bareTLD } from '@lit-web3/ethers/src/nsResolver/checker'
import { openPopup } from '~/lib.next/background/notifier'
import { ERR_USER_DENIED } from '~/lib.next/constants'
import backgroundMessenger from '~/lib.next/messenger/background'

export const DOID_setup: BackgroundService = {
  method: 'DOID_setup',
  middlewares: [],
  fn: async ({ req, res }, next) => {
    backgroundMessenger.send('DOID_account_change', { bb: 8 })
    const [doid] = req.body
    openPopup(`/landing/${bareTLD(doid)}`)
    let onClose = () => next(true, new Error(ERR_USER_DENIED))
    backgroundMessenger.emitter.once('popup_closed', onClose)
    backgroundMessenger.on('reply_DOID_setup', ({ data }) => {
      backgroundMessenger.emitter.off('popup_closed', onClose)
      res.body = data
    })
  }
}
