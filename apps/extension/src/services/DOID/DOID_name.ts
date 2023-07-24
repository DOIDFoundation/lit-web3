import { unlock, autoClosePopup } from '~/middlewares'
import { requestConnecteDOIDs } from '~/middlewares'

export const DOID_name: BackgroundService = {
  method: 'DOID_name',
  allowInpage: true,
  middlewares: [requestConnecteDOIDs(), autoClosePopup],
  fn: async ({ state, res }) => {
    res.body = state.DOID.name
  }
}
