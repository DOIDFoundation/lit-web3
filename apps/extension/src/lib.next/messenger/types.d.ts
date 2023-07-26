/// <reference types="webext-bridge" />
/// <reference types="~/lib.next/constants" />

declare interface CrossContextMessenger {
  sendMessage: Function
  onMessage: Function
}
declare interface MESSENGER {
  dest: string
  send: typeof sendMessage
  on: typeof onMessage
  log: Function
  messenger: EndpointRuntime
}

declare type MessengerDest = undefined | keyof typeof MessageContext

declare type MessengerSendDest = { id?: number; host?: string } | string | undefined

declare type MessengerSend = (messageID: string, data?: any, destination?: MessengerSendDest) => Promise<any>

declare type MessengerOn = (messageID: string, listener: EventListener) => any
