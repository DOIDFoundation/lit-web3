import log from 'loglevel'

interface options {
  origin: string
}
export const createLoggerMiddleware = function (opts: options) {
  return function loggerMiddleware(req: any, res: any, next: Function) {
    next((cb: Function) => {
      if (res.error) {
        log.error('Error in RPC response:\n', res)
      }
      if (req.isMetamaskInternal) {
        return
      }
      log.info(`RPC (${opts.origin}):`, req, '->', res)
      cb()
    })
  }
}
