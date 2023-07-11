// Motivation
// 1. There is no way to genarate a single iife file by vite so far
// 2. @crxjs/vite-plugin's hmr cannot watch for dist folder
// Risk
// 1. `public/inpage.js` will be regenerated & committed every time
import { viteConfig } from '@lit-web3/dui/src/shared/vite.config.cjs'
import { sharedConfig } from './vite.config'
import { resolve } from 'node:path'

// Use public path to trick public copies (https://github.com/vitejs/vite/issues/1492), it could be rewrite by @crxjs/vite-plugin
const outDir = 'public'

export default async ({ mode = '' }) => {
  const isDev = mode === 'development'
  const config: any = await sharedConfig(mode)
  config.build = {
    outDir,
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/ext.entries/inpage.ts'),
      name: 'inpage',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        entryFileNames: 'inpage.js',
        extend: true
      }
    }
  }
  config.viteConfigOptions.html = false
  return viteConfig(config)({ mode })
}
