import log from 'loglevel'
import type { JsonRpcMiddleware } from 'json-rpc-engine'

export const createDupeReqFilterMiddleware = function () {
  const processedRequestId: any[] = []
  return function filterDuplicateRequestMiddleware(req: any, _res: any, next: Function, end: Function) {
    if (processedRequestId.indexOf(req.id) >= 0) {
      log.info(`RPC request with id ${req.id} already seen.`)
      return end()
    }
    processedRequestId.push(req.id)
    return next()
  }
}
