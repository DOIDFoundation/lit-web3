/// <reference types="webext-bridge" />
/// <reference types="~/lib.next/constants" />

declare interface Emitter {
  sendMessage: Function
  onMessage: Function
}
declare interface MESSENGER {
  dest: string
  send: typeof sendMessage
  on: typeof onMessage
  log: Function
  emitter: Emitter
}

declare type MessengerSend = (messageID: string, data: any, destination?: keyof typeof MessageContext) => Promise<any>
