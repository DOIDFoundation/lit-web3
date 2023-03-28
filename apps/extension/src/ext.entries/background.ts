// service worker entry for extension

import { backgroundLogger } from '~/lib.next/logger'
import backgroundMessenger from '~/lib.next/messenger/background'
import Notifier from '~/lib.next/notifier'

// DOID_setup Sample
backgroundMessenger.on('DOID_setup', ({ data }) => {
  backgroundMessenger.log(data)
  try {
    Notifier.showPopup()
  } catch (e) {
    console.log(e)
  }
})

// App init (TODO: move to src/lib/background.scripts)
browser.runtime.onConnect.addListener(async (port: chrome.runtime.Port) => {
  // connectRemote(port)
})

backgroundLogger('started')
