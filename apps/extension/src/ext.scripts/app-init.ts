// ref: @metamask-extention/app/scripts/app-init.js
import '@lit-web3/core/src/shims/node'
import '~/lib/webextension-polyfill'
// import { shouldInjectProvider } from '~/lib/providers/injection'
import { deferredPromise } from '~/lib/utils'
import { initController } from '~/lib/keyringController'
import { sendReadyMessageToTabs } from '~/ext.scripts/sw/swGlobal'
import { sleep } from '@lit-web3/ethers/src/utils'

import { connectRemote, connectExternal } from '~/ext.scripts/sw/connectRemote'

const logger = (...args: any) => console.info(`[sw]`, ...args)

self.addEventListener('install', function (event) {
  self.skipWaiting()
  logger('Installed', event)
})
self.addEventListener('activate', function (event) {
  logger('Activated', event)
})
self.addEventListener('push', function (event) {
  logger('Push message received', event)
})
self.addEventListener('updated', function (event) {
  logger('updated', event)
})
browser.action.setPopup({ popup: './popup.html' })
browser.action.onClicked.addListener((tab: typeof browser.tabs) => {
  logger('onClicked')
  browser.scripting.executeScript({
    target: { tabId: tab.id },
    function: function () {}
  })
})
logger(self)

browser.runtime.onMessage.addListener(() => {
  return false
})
browser.runtime.onStartup.addListener(() => {
  globalThis.isFirstTimeProfileLoaded = true
})
browser.runtime.onConnect.addListener(async (port: chrome.runtime.Port) => {
  await isInitialized
  connectRemote(port)
})
browser.runtime.onConnectExternal.addListener(async (port: chrome.runtime.Port) => {
  logger('onConnectExternal')
  await isInitialized
  connectExternal(port)
})

// S
const { promise: isInitialized, resolve: resolveInitialization, reject: rejectInitialization } = deferredPromise()

async function initialize() {
  try {
    await initController()
    await sleep(50)
    await sendReadyMessageToTabs()
    // @ts-expect-error
    resolveInitialization()
    logger('app-init complete.')
  } catch (error) {
    // @ts-expect-error
    rejectInitialization(error)
  }
}
initialize().catch(logger)
// E
// We use manifet.config.ts to inject inpage.js (see `src/ext.script/inpage.ts`), but Metamask said manifest has a bug due to:
/*
 * This content script is injected programmatically because
 * MAIN world injection does not work properly via manifest
 * https://bugs.chromium.org/p/chromium/issues/detail?id=634381
 */
// if (shouldInjectProvider('init')) {
// const registerInPageContentScript = async () => {
//   try {
//     await browser.scripting.registerContentScripts([
//       {
//         id: 'inpage',
//         js: ['/public/inpage.js'],
//         matches: ['https://*/*', 'http://*/*', 'file://*/*'],
//         runAt: 'document_start',
//         world: 'MAIN'
//       }
//     ])
//   } catch (err) {
//     console.warn(`Dropped attempt to register inpage content script. ${err}`)
//   }
// }
// registerInPageContentScript()
// }
