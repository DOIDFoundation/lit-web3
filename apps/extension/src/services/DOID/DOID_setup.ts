import backgroundMessenger from '~/lib.next/messenger/background'
import { DOIDBodyParser, popupGoto, autoClosePopup } from '~/middlewares'
import { ERR_USER_DENIED } from '~/lib.next/constants'

export const DOID_setup: BackgroundService = {
  method: 'DOID_setup',
  allowInpage: true,
  middlewares: [DOIDBodyParser(), popupGoto({ path: `/landing/:name` }), autoClosePopup],
  fn: async ({ res }) => {
    const unlisten = backgroundMessenger.on('reply_DOID_setup', ({ data }) => {
      const bytes = data?.bytes as Uint8Array
      res.body = { bytes: bytes.toString() }
    })
    backgroundMessenger.emitter.once('popup_closed', () => {
      res.err = new Error(ERR_USER_DENIED)
      unlisten()
    })
  }
}
