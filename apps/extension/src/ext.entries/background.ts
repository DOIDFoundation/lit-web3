// service worker entry for extension
import '@lit-web3/core/src/shims/node'
import browser from 'webextension-polyfill'
import { connectRemote } from '~/lib.next/background/connectRemote'
import { loadAllServices } from '~/services'

loadAllServices() // Load all Background Services

// App init (TODO: move to src'~/lib/background.scripts)
browser.runtime.onConnect.addListener(async (port: browser.Runtime.Port) => {
  await 0
  console.log('connectRemote')
  connectRemote(port)
})
