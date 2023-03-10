// import { crx } from '@crxjs/vite-plugin'
// S Here is a temporary hack for @crxjs/vite-plugin@2.0.0-beta.13
import fs from 'fs'
const depPath = resolve(__dirname, 'node_modules/@crxjs/vite-plugin/dist/index.mjs')
const depJsSrc = fs.readFileSync(depPath, 'utf8')
const reg = /page\.scripts\.push\(\.\.\.scripts\)/
if (/reg/.test(depJsSrc)) {
  fs.writeFileSync(depPath, depJsSrc.replace(reg, `page?.scripts.push(...scripts)`))
}
// E
// S touch public/inpage.js
const inpagPath = resolve(__dirname, 'public/inpage.js')
try {
  const time = new Date()
  fs.utimesSync(inpagPath, time, time)
} catch (e) {
  const fd = fs.openSync(inpagPath, 'w')
  fs.closeSync(fd)
}
// E

import { viteConfig } from '@lit-web3/dui/src/shared/vite.config.cjs'
import manifest from './manifest.config'
import { dirname, relative, resolve } from 'path'
import nodePolyfills from 'rollup-plugin-polyfill-node'
// import AutoImport from 'unplugin-auto-import/vite'

export const sharedConfig = async (mode = '') => {
  const [port, isDev] = [4831, mode === 'development']
  const shimNode = (s: string) => resolve(__dirname, '../../packages/core/src/shims/node', s)
  return {
    resolve: {
      alias: {
        stream: shimNode('stream.ts'),
        util: shimNode('util.js'),
        assert: shimNode('assert.js'),
        'obj-multiplex': '@metamask/object-multiplex'
      }
    },
    server: { port, https: false, hmr: { port } },
    build: {
      emptyOutDir: !isDev,
      // so annoying, here will break in build stage
      rollupOptions: {
        input: {
          background: 'index.html',
          popup: 'popup.html'
        }
      }
    },
    plugins: [
      // rewrite assets to use relative path
      {
        name: 'assets-rewrite',
        enforce: 'post',
        apply: 'build',
        transformIndexHtml(html: string, { path = '' }) {
          return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
        }
      }
    ],
    optimizeDeps: {
      include: ['webextension-polyfill', 'rollup-plugin-polyfill-node']
    },
    viteConfigOptions: {
      pwa: false,
      legacy: false,
      copies: []
    }
  }
}

export default async ({ mode = '' }) => {
  const config = await sharedConfig(mode)
  const { crx } = await import('@crxjs/vite-plugin')
  config.plugins.push(...([nodePolyfills(), crx({ manifest })] as any[]))
  return viteConfig(config)({ mode })
}
