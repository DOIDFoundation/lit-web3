/// <reference types="webext-bridge/" />
declare type BackgroundMiddlwareCtx = BridgeMessage<JsonValue>
declare type BackgroundMiddlware = (ctx: BackgroundMiddlwareCtx, next: Promise) => Promise<any>

declare interface BackgroundService {
  method: string
  middlewares: BackgroundMiddlware[]
  fn: BackgroundMiddlware
}
