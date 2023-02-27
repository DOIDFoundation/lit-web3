// AKA inject.ts (just used to inject inpage.js)
import '@lit-web3/core/src/shims/node'
// @ts-expect-error
import inpage from '/public/inpage.js?script&module'

const logger = (...args: any) => console.info(`[DOID][contentscript]`, ...args)

if (typeof chrome !== 'undefined') {
  const s = document.createElement('script')
  s.src = chrome.runtime.getURL(inpage)
  s.onload = () => s.remove()
  const target = document.head || document.documentElement
  target.appendChild(s)
}

logger('started')
