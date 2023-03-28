import { Messenger } from './base'
import * as Background from 'webext-bridge/background'
import { publicMethods, privateMethods } from '~/lib.next/constants'

// background <-> popup
export const backgroundToPopup = new Messenger('background', 'popup', Background)
// background <-> inpage
export const backgroundToInpage = new Messenger('background', 'inpage', Background)

class BackgroundMessenger extends Messenger implements MESSENGER {
  constructor() {
    super('background', 'popup', backgroundToPopup.emitter)
  }
  // Response to destination by method
  // 'DOID_sth' -> popup & inpage
  // 'doid_sth' -> popup
  send: MessengerSend = async (method, params, dest = this.dest) => {
    let promise
    if (method in publicMethods) promise = backgroundToInpage.send(method, params)
    if (method in privateMethods) promise = backgroundToPopup.send(method, params)
    return await promise
  }
}

export const backgroundMessenger = new BackgroundMessenger()

export default backgroundMessenger
