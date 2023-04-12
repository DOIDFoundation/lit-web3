/// <reference types="webext-bridge/" />
declare type webextMessage = BridgeMessage<JsonValue>

declare type Header = {
  isInner: boolean // If request origin is content/background/popup
  origin: string
}
declare type Req = {
  method: string
  body: JsonValue
  headers: Header
  raw: webextMessage
}
declare type Res = {
  body: JsonValue
  end: Function
  responder: Promise<void>
  respond: boolean
  err?: Error
}

declare interface BackgroundMiddlwareCtx {
  req: Req
  res: Res
  state: JsonValue
}
declare type BackgroundMiddlware = (ctx: BackgroundMiddlwareCtx, next: Promise) => Promise<any>

declare interface BackgroundService {
  method: string
  middlewares: BackgroundMiddlware[]
  fn: (ctx: BackgroundMiddlwareCtx, next?: Promise) => Promise<any>
}
