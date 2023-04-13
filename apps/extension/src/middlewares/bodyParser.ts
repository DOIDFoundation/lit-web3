import { bareTLD } from '@lit-web3/ethers/src/nsResolver/checker'

export const DOIDBodyParser = (): BackgroundMiddlware => {
  return async ({ req, state }, next) => {
    let [DOIDName] = req.body
    DOIDName = bareTLD(DOIDName)
    Object.assign(state, { DOIDName })
    return next()
  }
}
