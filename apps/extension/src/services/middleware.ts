// Simple middleware implementation
import { isInternalEndpoint } from 'webext-bridge'

export class MiddlerwareEngine {
  ctx: BackgroundMiddlwareCtx
  middlewares: BackgroundMiddlware[]
  currentResolver: any
  constructor(message: webextMessage, middlewares: BackgroundMiddlware[]) {
    this.ctx = {
      req: createReq(message),
      res: createRes(),
      state: {}
    }
    this.middlewares = middlewares
    this.currentResolver = null
  }
  _settleAll = () => {
    if (this.ctx.res.respond) this.currentResolver.resolve()
    else this.currentResolver.reject()
  }
  resolve = async () => {
    // On body written
    this.ctx.res.responder.finally(this._settleAll)
    //
    try {
      for (const _middleware of this.middlewares) {
        await new Promise<void>((resolve, reject) => {
          this.currentResolver = { resolve, reject }
          if (this.ctx.res.respond) resolve()
          else
            _middleware(this.ctx, function (res: any, err: any) {
              if (err) reject(err)
              else resolve(res)
            }).catch(reject)
        })
      }
    } catch (err) {
      throw err
    }
    return this.ctx.res.body
  }
}

const createReq = (message: webextMessage): Req => {
  const { data: body, sender, id: method } = message
  const { context: origin } = sender
  const isInner = isInternalEndpoint(sender)
  return { raw: Object.freeze(message), method, body, headers: { origin, isInner } }
}

const createRes = (): Res => {
  let _resolve: any
  const responder = new Promise<void>((resolve) => {
    _resolve = resolve
  })
  let _data: any
  const res = {
    respond: false,
    get body() {
      return _data
    },
    set body(content: any) {
      res.end(content)
    },
    end: async (data: any) => {
      if (res.respond) return console.warn('Res body has already been used.')
      res.respond = true
      _resolve((_data = data))
    },
    responder
  }
  return res
}
