import browser from 'webextension-polyfill'
import { popupStore } from '~/lib.next/background/store/popupStore'
import backgroundMessenger from '~/lib.next/messenger/background'

browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!popupStore.previousTabId) {
    popupStore.previousTabId = tabId
    return
  }
  let tab: browser.Tabs.Tab | undefined = undefined
  try {
    tab = await browser.tabs.get(popupStore.previousTabId)
    popupStore.previousTabId = tabId
  } catch {
    return
  }
  // eslint-disable-next-line no-console
  backgroundMessenger.send('tab-prev', { title: tab.title }, `window@${tabId}`)
})

backgroundMessenger.emitter.on('lock', () => {
  backgroundMessenger.send('state_lock')
})
