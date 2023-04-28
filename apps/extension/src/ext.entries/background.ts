// service worker entry for extension
// Some deps still use `window`
if (!('window' in globalThis)) Object.defineProperty(globalThis, 'window', { value: globalThis })
// import '@lit-web3/core/src/shims/node'
import browser from 'webextension-polyfill'
import { connectRemote } from '~/lib.next/background/connectRemote'
import { loadAllServices } from '~/services'

loadAllServices() // Load all Background Services

// App init (TODO: move to src'~/lib/background.scripts)
browser.runtime.onConnect.addListener(async (port: browser.Runtime.Port) => {
  await 0
  connectRemote(port)
})
