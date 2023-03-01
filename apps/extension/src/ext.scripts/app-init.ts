// ref: @metamask-extention/app/scripts/app-init.js
import { shouldInjectProvider } from '~/lib/providers/injection'
import { deferredPromise } from '~/lib/utils'

import { connectRemote } from '~/ext.scripts/sw/connectRemote'

const logger = (...args: any) => console.info(`[sw]`, ...args)

self.addEventListener('install', function (event) {
  self.skipWaiting()
  console.log('[background] Installed', event)
})
self.addEventListener('activate', function (event) {
  console.log('[background] Activated', event)
})
self.addEventListener('push', function (event) {
  console.log('[background] Push message received', event)
})
self.addEventListener('updated', function (event) {
  console.log('[background] updated')
})
// chrome.action.setPopup({ popup: './popup.html' })
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: function () {}
  })
})
console.log('[service-worker]', self)

chrome.runtime.onMessage.addListener((e) => {
  return false
})
chrome.runtime.onStartup.addListener((e) => {
  globalThis.isFirstTimeProfileLoaded = true
})
chrome.runtime.onConnect.addListener(async (...args) => {
  await isInitialized
  connectRemote(...args)
})
chrome.runtime.onConnectExternal.addListener(async (...args) => {})

// S
let connectExternal
const { promise: isInitialized, resolve: resolveInitialization, reject: rejectInitialization } = deferredPromise()

async function initialize() {
  try {
    const initState = await loadStateFromPersistence()
    const initLangCode = await getFirstPreferredLangCode()
    setupController(initState, initLangCode)
    if (!isManifestV3) {
      await loadPhishingWarningPage()
    }
    await sendReadyMessageToTabs()
    log.info('MetaMask initialization complete.')
    resolveInitialization()
  } catch (error) {
    rejectInitialization(error)
  }
}
initialize().catch(logger)

// E

if (import.meta.hot) {
  // @crxjs/vite-plugin@2.0.0-beta.13 not always working
  // @ts-ignore
  import('/@vite/client')
  // @ts-ignore
  import('./inpage.hmr')
}

// We use manifet.config.ts to inject inpage.js (see `src/ext.script/inpage.ts`), but Metamask said manifest has a bug due to:
/*
 * This content script is injected programmatically because
 * MAIN world injection does not work properly via manifest
 * https://bugs.chromium.org/p/chromium/issues/detail?id=634381
 */
// if (shouldInjectProvider('init')) {
//   const registerInPageContentScript = async () => {
//     try {
//       await chrome.scripting.registerContentScripts([
//         {
//           id: 'inpage',
//           js: ['inpage.js'],
//           matches: ['https://*/*', 'http://*/*', 'file://*/*'],
//           runAt: 'document_start',
//           world: 'MAIN'
//         }
//       ])
//     } catch (err) {
//       console.warn(`Dropped attempt to register inpage content script. ${err}`)
//     }
//   }
//   registerInPageContentScript()
// }
