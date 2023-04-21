import browser from 'webextension-polyfill'
import { popupStorage } from '~/lib.next/background/storage/popupStorage'
import backgroundMessenger from '~/lib.next/messenger/background'

browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!popupStorage.previousTabId) {
    popupStorage.previousTabId = tabId
    return
  }
  let tab: browser.Tabs.Tab | undefined = undefined
  try {
    tab = await browser.tabs.get(popupStorage.previousTabId)
    popupStorage.previousTabId = tabId
  } catch {
    return
  }
  console.log({ tabId })
  // eslint-disable-next-line no-console
  // backgroundMessenger.send('tab_prev', { title: tab.title }, `window@${tabId}`)
})
