import { bareTLD, wrapTLD } from '@lit-web3/ethers/src/nsResolver/checker'

export const DOIDBodyParser = (): BackgroundMiddlware => {
  return async ({ req, state }, next) => {
    const { body } = req
    // DOIDName
    let reqName = ''
    if (Array.isArray(body)) {
      ;[reqName] = body
    } else {
      reqName = body.DOIDName ?? body.DOID ?? body.doid ?? body.doidName ?? body.name ?? ''
    }
    const [name, DOIDName] = [bareTLD(reqName), wrapTLD(reqName)]
    // pwd/phrase/host
    const { pwd, phrase, host } = body
    //
    Object.assign(state, { name, DOIDName, host, pwd, phrase })
    return next()
  }
}
