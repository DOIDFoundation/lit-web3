import swGlobal from '~/ext.scripts/sw/swGlobal'
import { triggerUi } from './triggerUi'
import { SECOND } from '@lit-web3/core/src/constants/time'

export const openPopup = async function () {
  await triggerUi()
  await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!swGlobal.notificationIsOpen) {
        clearInterval(interval)
        resolve(true)
      }
    }, SECOND)
  })
}
