import backgroundMessenger from '~/lib.next/messenger/background'
import { DOIDBodyParser, gotoPopup, autoClosePopup } from '~/middlewares'

export const DOID_setup: BackgroundService = {
  method: 'DOID_setup',
  allowInpage: true,
  middlewares: [DOIDBodyParser(), gotoPopup(`/landing/:name`), autoClosePopup],
  fn: async ({ res }) => {
    backgroundMessenger.on('reply_DOID_setup', ({ data }) => {
      const bytes = data?.bytes as Uint8Array
      res.body = { bytes: bytes.toString() }
    })
  }
}
