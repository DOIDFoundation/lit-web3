/// <reference types="webext-bridge/" />
declare type webextMessage = BridgeMessage<JsonValue>

declare type Header = Record<string, any>
declare type Req = {
  raw: webextMessage
  headers: Header
}
declare type Res = {
  body: any
  end: Function
  responder: Promise<void>
  headers: Header
  respond: boolean
  data?: any
}

declare interface BackgroundMiddlwareCtx {
  req: Req
  res: Res
}
declare type BackgroundMiddlware = (ctx: BackgroundMiddlwareCtx, next: Promise) => Promise<any>

declare interface BackgroundService {
  method: string
  middlewares: BackgroundMiddlware[]
  fn: (ctx: BackgroundMiddlwareCtx) => Promise<any>
}
