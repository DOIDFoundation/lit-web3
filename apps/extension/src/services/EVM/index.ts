import backgroundMessenger from '~/lib.next/messenger/background'
import { openPopup, closePopup } from '~/lib.next/background/notifier'

backgroundMessenger.on('eth_account', ({ data }) => {
  return new Promise(async (resolve) => {
    resolve([])
  })
})
