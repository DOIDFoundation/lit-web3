import backgroundMessenger from '~/lib.next/messenger/background'
import { unlock, autoClosePopup } from '~/middlewares'

const mockApi = async () => {
  await 0
  return { publicKey: 'jaksdiuzoxdf', address: { BTC: 'd', ETH: 'dsad' } }
}

export const DOID_setup: BackgroundService = {
  method: 'DOID_setup',
  middlewares: [unlock, autoClosePopup],
  fn: async (ctx) => {
    const data = await mockApi()
    ctx.res.body = data
    // backgroundMessenger.on('reply_DOID_setup', ({ data }) => {

    // })
  }
}
