import { unlock, autoClosePopup } from '~/middlewares'
import { getAccount } from '~/middlewares'

export const DOID_name: BackgroundService = {
  allowInpage: true,
  method: 'DOID_name',
  middlewares: [unlock(), getAccount, autoClosePopup],
  fn: async ({ state, res }) => {
    res.body = state.DOID.name
  }
}
