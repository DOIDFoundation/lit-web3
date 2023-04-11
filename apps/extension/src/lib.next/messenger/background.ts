import { Messenger } from './base'
import * as Background from 'webext-bridge/background'
import { publicMethods } from '~/lib.next/constants'

// background <-> popup
export const backgroundToPopup = new Messenger('background', 'popup', Background)
// background <-> inpage
export const backgroundToInpage = new Messenger('background', 'inpage', Background)

class BackgroundMessenger extends Messenger implements MESSENGER {
  constructor() {
    super('background', 'popup', backgroundToPopup.messenger)
  }
  // Response to destination by method
  // publicMethods -> popup & inpage
  // privateMethods -> popup (Always pass private methods, so far)
  send: MessengerSend = async (method, params = {}, dest = this.dest) => {
    let promise
    if (publicMethods.includes(method)) promise = backgroundToInpage.send(method, params)
    promise = backgroundToPopup.send(method, params)
    return await promise
  }
}

export const backgroundMessenger = new BackgroundMessenger()

export default backgroundMessenger
