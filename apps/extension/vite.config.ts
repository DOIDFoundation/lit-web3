import { viteConfig } from '@lit-web3/dui/src/shared/vite.config.cjs'
import manifest from './manifest.config'
import { dirname, relative, resolve } from 'path'
// S Here is a temporary hack for @crxjs/vite-plugin@2.0.0-beta.12
// import { crx } from '@crxjs/vite-plugin'
import fs from 'fs'
import path from 'path'
const depPath = path.resolve(__dirname, 'node_modules/@crxjs/vite-plugin/dist/index.mjs')
const depJsSrc = fs.readFileSync(depPath, 'utf8')
const reg = /page\.scripts\.push\(\.\.\.scripts\)/
if (/reg/.test(depJsSrc)) {
  fs.writeFileSync(depPath, depJsSrc.replace(reg, `page?.scripts.push(...scripts)`))
}
// E

export default async ({ mode = '' }) => {
  const { crx } = await import('@crxjs/vite-plugin')
  return viteConfig({
    server: { port: 4813, https: false, hmr: { port: 4813 } },
    plugins: [
      crx({ manifest }),
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
    build: {
      rollupOptions: {
        input: {
          background: resolve(__dirname, 'index.html'),
          popup: resolve(__dirname, 'popup.html')
        }
      }
    },
    viteConfigOptions: {
      pwa: false,
      copies: []
    }
  })({ mode })
}
