// import { crx } from '@crxjs/vite-plugin'
import { resolve, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
// Env
const cwd = process.cwd()
const __dirname = dirname(fileURLToPath(import.meta.url))
const { env } = process
const [pathRoot, pathSrc] = [env.INIT_CWD, resolve(cwd, './src')]
// S Here is a temporary hack for @crxjs/vite-plugin@2.0.0-beta.13
import fs from 'node:fs'
const depPath = resolve(__dirname, 'node_modules/@crxjs/vite-plugin/dist/index.mjs')
const depJsSrc = fs.readFileSync(depPath, 'utf8')
const reg = /page\.scripts\.push\(\.\.\.scripts\)/
if (/reg/.test(depJsSrc)) {
  fs.writeFileSync(depPath, depJsSrc.replace(reg, `page?.scripts.push(...scripts)`))
}
// E
// S Touch git-ignored `public/inpage.js`
const inpagPath = resolve(__dirname, 'public/inpage.js')
try {
  const time = new Date()
  fs.utimesSync(inpagPath, time, time)
} catch (e) {
  const fd = fs.openSync(inpagPath, 'w')
  fs.closeSync(fd)
}
// E

import { viteConfig } from '@lit-web3/dui/src/shared/vite.config.js'
import manifest from './manifest.config'
import AutoImport from 'unplugin-auto-import/vite'

export const sharedConfig = async (mode = '') => {
  return {
    plugins: [
      // rewrite assets to use relative path
      {
        name: 'assets-rewrite',
        enforce: 'post',
        apply: 'build',
        transformIndexHtml(html = '', { path = '' }) {
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

export const sharedExtConfig = async (mode = '') => {
  const config = await sharedConfig(mode)
  const [isDev] = [mode === 'development']
  config.plugins.push(
    ...[
      AutoImport({
        imports: [{ 'webextension-polyfill': [['*', 'browser']] }],
        dts: resolve(pathSrc, 'auto-imports.d.ts')
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
  config.plugins.push(...[crx({ manifest })])
  config.server = { port, https: false, hmr: { port } }
  config.build.rollupOptions = {
    input: {
      index: 'index.html'
    }
  }

  return viteConfig(config)({ mode })
}
