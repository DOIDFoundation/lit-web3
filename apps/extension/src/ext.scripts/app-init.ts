// ref: @metamask-extention/app/scripts/app-init.js
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
chrome.action.setPopup({ popup: './popup.html' })
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: function () {}
  })
})
console.log('[DOID][service-worker]', self)

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
// const registerInPageContentScript = async () => {
//   try {
//     await chrome.scripting.registerContentScripts([
//       {
//         id: 'inpage',
//         js: ['inpage.js'],
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
