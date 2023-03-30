// service worker entry for extension
if (!('window' in globalThis)) Object.defineProperty(globalThis, 'window', { value: globalThis })
import browser from 'webextension-polyfill'
import { backgroundLogger } from '~/lib.next/logger'
import backgroundMessenger from '~/lib.next/messenger/background'
import Notifier from '~/lib.next/background/notifier'
import { connectRemote } from '~/lib.next/background/connectRemote'
import { popupStore } from '~/lib.next/background/store/popupStore'
import { closePopup } from '~/lib.next/background/notifier'

// DOID_setup Sample
// TODO: middlewares like some intercepter
backgroundMessenger.on('DOID_setup', ({ data }) => {
  return new Promise((resolve) => {
    backgroundMessenger.log(data)
    try {
      Notifier.openPopup()
    } catch (e) {
      console.log(e)
    }
    backgroundMessenger.on('DOID_setup_reply', ({ data }) => {
      resolve(data)
      closePopup()
    })
  })
})

// App init (TODO: move to src'~/lib/background.scripts)
browser.runtime.onConnect.addListener(async (port: browser.Runtime.Port) => {
  await 0
  console.log('connectRemote')
  connectRemote(port)
})
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!popupStore.previousTabId) {
    popupStore.previousTabId = tabId
    return
  }

  let tab: browser.Tabs.Tab

  try {
    tab = await browser.tabs.get(popupStore.previousTabId)
    popupStore.previousTabId = tabId
  } catch {
    return
  }
  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  backgroundMessenger.send('tab-prev', { title: tab.title }, `window@${tabId}`)
})

backgroundLogger('started')
