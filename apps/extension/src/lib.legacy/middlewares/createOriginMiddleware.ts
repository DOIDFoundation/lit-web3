import type { JsonRpcMiddleware } from 'json-rpc-engine'
interface options {
  origin: string
}
export const createOriginMiddleware = function (opts: options) {
  return function originMiddleware(req: any, _: any, next: Function) {
    req.origin = opts.origin
    next()
  }
}
