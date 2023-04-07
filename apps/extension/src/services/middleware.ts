// Simple middleware implementation

export class MiddlerwareEngine {
  ctx: BackgroundMiddlwareCtx
  middlewares: BackgroundMiddlware[]
  currentResolver: any
  constructor(message: webextMessage, middlewares: BackgroundMiddlware[]) {
    this.ctx = {
      req: createReq(message),
      res: createRes()
    }
    this.middlewares = middlewares
    this.currentResolver = null
  }
  settleAll = () => {
    if (this.ctx.res.respond) this.currentResolver.resolve()
    else this.currentResolver.reject()
  }
  resolve = async () => {
    // On body written
    this.ctx.res.responder.finally(this.settleAll)
    //
    for (let middleware of this.middlewares) {
      await new Promise<void>((resolve, reject) => {
        this.currentResolver = { resolve, reject }
        if (this.ctx.res.respond) return resolve()
        middleware(this.ctx, resolve)
      })
    }
    return this.ctx.res.body
  }
}

const createReq = (message: webextMessage): Req => {
  return { raw: message, headers: createHeaders() }
}

const createRes = (): Res => {
  let _resolve: any
  const responder = new Promise<void>((resolve) => {
    _resolve = resolve
  })
  const res = {
    respond: false,
    data: undefined,
    get body() {
      return res.data
    },
    set body(content: any) {
      if (res.respond) console.warn('Res body has already been used.')
      else res.end(content)
    },
    end: async (data: any) => {
      res.respond = true
      res.data = data
      _resolve(data)
    },
    responder,
    headers: createHeaders()
  }
  return res
}

const createHeaders = (): Header => ({})
