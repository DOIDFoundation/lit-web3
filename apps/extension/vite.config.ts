// import { crx } from '@crxjs/vite-plugin'
// S Here is a temporary hack for @crxjs/vite-plugin@2.0.0-beta.13
import fs from 'node:fs'
const depPath = resolve(__dirname, 'node_modules/@crxjs/vite-plugin/dist/index.mjs')
const depJsSrc = fs.readFileSync(depPath, 'utf8')
const reg = /page\.scripts\.push\(\.\.\.scripts\)/
if (/reg/.test(depJsSrc)) {
  fs.writeFileSync(depPath, depJsSrc.replace(reg, `page?.scripts.push(...scripts)`))
}
// E

import { viteConfig } from '@lit-web3/dui/src/shared/vite.config.cjs'
import manifest from './manifest.config'
import { dirname, relative, resolve } from 'node:path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

import AutoImport from 'unplugin-auto-import/vite'

type viteConfig = Record<string, any>
export const sharedConfig = async (mode?: string): Promise<viteConfig> => {
  // const shimNode = (s: string) => resolve(__dirname, '../../packages/core/src/shims/node', s)
  return {
    resolve: {
      alias: {
        // stream: shimNode('stream.ts')
        // util: shimNode('util.js'),
        // assert: shimNode('assert.js')
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
      include: ['webextension-polyfill']
    },
    viteConfigOptions: {
      pwa: false,
      legacy: false,
      splitChunk: false,
      copies: []
    }
  }
}

export const sharedExtConfig = async (mode?: string): Promise<viteConfig> => {
  const config = await sharedConfig(mode)
  const [isDev] = [mode === 'development']
  config.plugins.push(
    ...[
      nodePolyfills(),
      AutoImport({
        imports: [{ 'webextension-polyfill': [['*', 'browser']] }],
        dts: resolve(__dirname, 'src/auto-imports.d.ts')
      })
    ]
  )
  config.build = {
    emptyOutDir: !isDev
  }
  return config
}

export default async ({ mode = '' }) => {
  const [port, isDev] = [4831, mode === 'development']
  const config = await sharedExtConfig(mode)
  const { crx } = await import('@crxjs/vite-plugin')
  config.plugins.push(...([crx({ manifest })] as any[]))
  config.server = { port, https: false, hmr: { port } }
  config.build.rollupOptions = {
    input: {
      index: 'index.html'
    }
  }

  return viteConfig(config)({ mode })
}
