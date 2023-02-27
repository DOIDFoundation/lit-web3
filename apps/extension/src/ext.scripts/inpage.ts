// inpage.js 101
// How does this file work?
// 1. This file will be compile to `public/inpage.js` with iife mode buy `build:inpage`
// 2. `public/inpage.js` will be injected by src/ext.scripts/contentscript.ts which is described in manifest.config.ts
// 3. `contentscript.ts` will executed in an "isolated world" environment
// 4. `inpage.js` will be injected to "main world" aka real browser environment

import '@lit-web3/core/src/shims/node'
// S These deps only works in extension
// import { WindowPostMessageStream } from '@metamask/post-message-stream'
// E
import { injectProvider } from '~/lib/providers/web3Provider'
import shouldInject from '~/lib/providers/injection'

const logger = (...args: any) => console.info(`[DOID][inpage]`, ...args)

// const inpageStream = new WindowPostMessageStream({
//   name: 'DOID-background',
//   target: 'DOID-inpage'
// })
// if (shouldInject()) injectProvider({ connectionStream: inpageStream })

const start = function () {
  logger('injected')
}
start()
