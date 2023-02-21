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
    function: fn
  })
})
console.log(self)

function fn() {}
