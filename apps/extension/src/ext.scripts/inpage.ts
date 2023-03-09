// inpage.js 101
// How does this file work?
// 1. This file will be compile to `public/inpage.js` with iife mode buy `build:inpage`
// 2. `public/inpage.js` will be injected by src/ext.scripts/contentscript.ts which is described in manifest.config.ts
// 3. `contentscript.ts` will executed in an "isolated world" environment
// 4. `inpage.js` will be injected to "main world" aka real browser environment

import '@lit-web3/core/src/shims/node'
// S MetaMask logics
let __define: any
const cleanContextForImports = () => {
  __define = global.define
  try {
    global.define = undefined
  } catch (_) {
    console.warn('DOID - global.define could not be deleted.')
  }
}
const restoreContextAfterImports = () => {
  try {
    global.define = __define
  } catch (_) {
    console.warn('DOID - global.define could not be overwritten.')
  }
}
cleanContextForImports()
// E

// S These deps only works in extension
import { WindowPostMessageStream } from '@metamask/post-message-stream'
// E
import { injectProvider } from '~/lib/providers'

restoreContextAfterImports()

const logger = (...args: any) => console.info(`[inpage]`, ...args)

const inpageStream = new WindowPostMessageStream({
  name: 'DOID-inpage',
  target: 'DOID-contentscript'
})

injectProvider({ connectionStream: inpageStream })

const start = function () {
  logger('injected')
}
start()
