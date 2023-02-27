import { viteConfig } from '@lit-web3/dui/src/shared/vite.config.cjs'
import manifest from './manifest.config'
import { dirname, relative, resolve } from 'path'
// import AutoImport from 'unplugin-auto-import/vite'

// S Here is a temporary hack for @crxjs/vite-plugin@2.0.0-beta.13
// import { crx } from '@crxjs/vite-plugin'
import fs from 'fs'
const depPath = resolve(__dirname, 'node_modules/@crxjs/vite-plugin/dist/index.mjs')
const depJsSrc = fs.readFileSync(depPath, 'utf8')
const reg = /page\.scripts\.push\(\.\.\.scripts\)/
if (/reg/.test(depJsSrc)) {
  fs.writeFileSync(depPath, depJsSrc.replace(reg, `page?.scripts.push(...scripts)`))
}
// E

export const sharedConfig = async (mode = '') => {
  const [port, isDev] = [4831, mode === 'development']
  return {
    server: { port, https: false, hmr: { port } },
    build: {
      minify: 'terser',
      emptyOutDir: !isDev,
      sourcemap: isDev ? 'inline' : false,
      terserOptions: {
        mangle: !isDev
      },
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
      include: ['webextension-polyfill']
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
  config.plugins.push(...([crx({ manifest })] as any[]))
  return viteConfig(config)({ mode })
}
