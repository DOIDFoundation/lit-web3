import backgroundMessenger from '~/lib.next/messenger/background'
import { openPopup, closePopup } from '~/lib.next/background/notifier'

backgroundMessenger.on('evm_request', ({ data }) => {
  return new Promise(async (resolve) => {
    resolve([])
  })
})
