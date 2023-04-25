import { unlock, autoClosePopup } from '~/middlewares'
import { getAccount } from '~/middlewares'

export const DOID_name: BackgroundService = {
  method: 'DOID_name',
  allowInpage: true,
  middlewares: [unlock(), getAccount(), autoClosePopup],
  fn: async ({ state, res }) => {
    res.body = state.DOID.name
  }
}
