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
            _middleware(this.ctx, function (res: any, err: Error) {
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
  const { context, tabId } = sender
  const isInternal = isInternalEndpoint(sender)
  const origin = `${context}@${tabId}`
  return { raw: Object.freeze(message), method, body, headers: Object.freeze({ origin, isInternal }) }
}

const createRes = (): Res => {
  let [_resolve, _reject] = [undefined as any, undefined as any]
  const responder = new Promise<void>((resolve, reject) => {
    ;[_resolve, _reject] = [resolve, reject]
  })
  let [_data, _err] = [undefined as any, undefined as any]
  const res = {
    respond: false,
    get body() {
      return _data
    },
    set body(content: any) {
      res.end(content)
    },
    get err() {
      return _err
    },
    set err(_err: Error) {
      res.end(null, _err)
    },
    end: async (data: any, err?: Error) => {
      if (res.respond) return console.warn('Res body has already been used.')
      res.respond = true
      if (err) _reject((_err = err))
      else _resolve((_data = data))
    },
    responder
  }
  return res
}
