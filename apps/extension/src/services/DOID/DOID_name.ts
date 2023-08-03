import { requestConnectedDOIDs, autoClosePopup } from '~/middlewares'

const DOIDs2Names = (DOIDs = <KeyringDOID[]>[]) => DOIDs.map((r) => r.name)

export const DOID_name: BackgroundService = {
  method: 'DOID_name',
  allowInpage: true,
  middlewares: [requestConnectedDOIDs({ passUnlock: true })],
  fn: async ({ state, res }) => {
    res.body = DOIDs2Names(state.DOIDs)
  }
}

export const DOID_requestName: BackgroundService = {
  method: 'DOID_requestName',
  allowInpage: true,
  middlewares: [requestConnectedDOIDs(), autoClosePopup],
  fn: async ({ state, res }) => {
    res.body = DOIDs2Names(state.DOIDs)
  }
}
