import { Messenger } from './base'
import * as Background from 'webext-bridge/background'
import { publicMethods } from '~/lib.next/constants'
import { getAllTabs } from '~/lib.next/utils.ext'

const parseDest = async (dest: MessengerSendDest): Promise<string | undefined> => {
  if (!dest) return
  if (typeof dest === 'string') return dest
  const { id, host } = dest
  if (id) return `window@${id}`
  if (host) {
    const [tab] = await getAllTabs({ url: `https://${host}/*` })
    if (tab) return `window@${tab.id}`
  }
  return
}

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
  send: MessengerSend = async (method, params = {}, dest) => {
    const calls = [
      // To popup (TODO: if method no listener in popup, will be crashing here)
      (() => {
        let promise
        try {
          promise = backgroundToPopup.send(method, params)
        } catch {}
        return promise
      })()
    ]
    // To inpage
    if (publicMethods.includes(method)) {
      calls.unshift(backgroundToInpage.send(method, params, await parseDest(dest)))
    }
    return (await Promise.all(calls))[0]
  }
  // TODO: This's not safe currently (ref: https://github.com/zikaari/webext-bridge/issues/37)
  broadcast: MessengerSend = async (method, params = {}) => {
    if (publicMethods.includes(method)) {
      const allTabs = await getAllTabs()
      allTabs.forEach(({ id: tabId }) => {
        backgroundToInpage.send(method, params, `window@${tabId}`)
      })
    } else {
      backgroundToPopup.send(method, params)
    }
  }
}

const backgroundMessenger = new BackgroundMessenger()

export default backgroundMessenger
