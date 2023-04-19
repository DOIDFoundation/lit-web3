// inpage.js 101
// How does this file work?
// 1. This file will be compile to `public/inpage.js` with iife mode buy `build:inpage`
// 2. `public/inpage.js` will be injected by src/ext.entries/contentscript.ts which is described in manifest.config.ts
// 3. `contentscript.ts` will executed in an "isolated world" environment
// 4. `inpage.js` will be injected to "main world" aka real browser environment
import { injectInpageProvider } from '~/lib.next/providers/inpageProvider'
import { injectEvmInpageProvider } from '~/lib.next/providers/evmInpageProvider'

injectInpageProvider()
injectEvmInpageProvider()
