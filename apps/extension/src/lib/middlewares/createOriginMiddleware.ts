interface options {
  origin: string
}
export const createOriginMiddleware = function (opts: options): Function {
  return function originMiddleware(req: any, _: any, next: Function) {
    req.origin = opts.origin
    next()
  }
}
