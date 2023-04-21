import type { onMessage } from 'webext-bridge/background'
import { ExtContext, MessageContext } from '~/lib.next/constants'
import emitter, { EventEmitter } from '@lit-web3/core/src/emitter'
import { logger } from '~/lib.next/logger'

export class Messenger implements MESSENGER {
  dest: string
  messenger: CrossContextMessenger
  log: Function
  emitter: EventEmitter
  // subscriber = new Map()
  constructor(context: keyof typeof ExtContext, dest: keyof typeof MessageContext, messenger: CrossContextMessenger) {
    this.dest = MessageContext[dest]
    this.messenger = messenger
    this.log = logger(ExtContext[context])
    this.emitter = emitter
  }
  send: MessengerSend = async (method, params = {}, dest = this.dest) => {
    if (!(dest as string).includes(this.dest))
      throw new Error(`Wrong destination. expected: ${this.dest}, currently: ${dest as string}`)
    return await this.messenger.sendMessage(method, params, dest)
  }
  on: typeof onMessage = (...args: any) => this.messenger.onMessage(...args)
}
