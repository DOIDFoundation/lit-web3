const ignoredProtocols = [
  'chrome-extension://',
  'chrome-search://',
  'chrome://',
  'devtools://',
  'edge://',
  'https://chrome.google.com/webstore'
]

export function isIgnoreUrl(url: string): boolean {
  return ignoredProtocols.some((protocol) => url.startsWith(protocol))
}

export const isFirefox = navigator.userAgent.includes('Firefox')

// Firefox fetch files from cache instead of reloading changes from disk,
// hmr will not work as Chromium based browser
browser.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
  // Filter out non main window events.
  if (frameId !== 0) return

  if (isIgnoreUrl(url)) return

  // inject the latest scripts
  browser.tabs
    .executeScript(tabId, {
      file: `${isFirefox ? '' : '..'}/public/inpage.js`,
      runAt: 'document_end'
    })
    .catch((error) => console.error(error))
})
