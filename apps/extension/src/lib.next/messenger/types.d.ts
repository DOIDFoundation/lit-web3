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
  messenger: CrossContextMessenger
}

declare type MessengerSend = (messageID: string, data?: any, destination?: keyof typeof MessageContext) => Promise<any>

declare type MessengerOn = (messageID: string, listener: EventListener) => any
