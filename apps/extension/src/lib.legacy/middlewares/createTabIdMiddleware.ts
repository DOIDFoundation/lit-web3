interface options {
  tabId: number
}
export const createTabIdMiddleware = function (opts: options) {
  return function tabIdMiddleware(req: any, _: any, next: Function) {
    req.tabId = opts.tabId
    next()
  }
}
