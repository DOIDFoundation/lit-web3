import backgroundMessenger from '~/lib.next/messenger/background'
import { closePopup } from '~/lib.next/background/notifier'
import { unlock } from '~/middlewares/unlock'

export const DOID_setup: BackgroundService = {
  method: 'DOID_setup',
  middlewares: [unlock],
  fn: async (ctx, next) => {
    backgroundMessenger.on('reply_DOID_setup', ({ data }) => {
      console.log('rec', data)
      next(data)
      closePopup()
    })
  }
}
