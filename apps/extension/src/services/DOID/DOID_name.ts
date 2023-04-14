// import { bareTLD } from '@lit-web3/ethers/src/nsResolver/checker'
// import { openPopup } from '~/lib.next/background/notifier'
// import { ERR_USER_DENIED } from '~/lib.next/constants'
import backgroundMessenger from '~/lib.next/messenger/background'
import { unlock, autoClosePopup } from '~/middlewares'
import { getAccount } from '~/middlewares'

export const DOID_name: BackgroundService = {
  method: 'DOID_name',
  middlewares: [unlock(), getAccount, autoClosePopup],
  fn: async ({ state, res }) => {
    res.body = state.account
  }
}
