import type { onMessage } from 'webext-bridge/background'
import { ExtContext, MessageContext } from '~/lib.next/constants'
import { logger } from '~/lib.next/logger'

export class Messenger implements MESSENGER {
  dest: string
  emitter: Emitter
  log: Function
  // subscriber = new Map()
  constructor(context: keyof typeof ExtContext, dest: keyof typeof MessageContext, emitter: Emitter) {
    this.dest = MessageContext[dest]
    this.emitter = emitter
    this.log = logger(ExtContext[context])
  }
  send: MessengerSend = async (method, params, dest = this.dest) => {
    return await this.emitter.sendMessage(method, params, dest)
  }
  on: typeof onMessage = (...args: any) => this.emitter.onMessage(...args)
}
