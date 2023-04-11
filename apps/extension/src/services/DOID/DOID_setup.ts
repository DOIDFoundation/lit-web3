import backgroundMessenger from '~/lib.next/messenger/background'
import { unlock, getAccount, autoClosePopup } from '~/middlewares'

const mockApi = async () => {
  await 0
  return { publicKey: 'jaksdiuzoxdf', address: { BTC: 'd', ETH: 'dsad' } }
}

export const DOID_setup: BackgroundService = {
  method: 'DOID_setup',
  middlewares: [autoClosePopup],
  fn: async ({ req, res }, next) => {
    backgroundMessenger.send('DOID_account_change', { bb: 1 })
    const [doidName] = req.body
    const data = await mockApi()
    res.body = data
    // backgroundMessenger.on('reply_DOID_setup', ({ data }) => {

    // })
  }
}
