import path, { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, splitVendorChunkPlugin, normalizePath } from 'vite'
//
import { VitePWA } from 'vite-plugin-pwa'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import minifyHTMLLiterals from 'rollup-plugin-minify-html-literals'

import { config } from 'dotenv'
// Polyfills
import legacy from '@vitejs/plugin-legacy'
import mkcert from 'vite-plugin-mkcert'

// Env
config()
const cwd = process.cwd()
const __dirname = dirname(fileURLToPath(import.meta.url))

const { env } = process
const [pathRoot, pathSrc] = [env.INIT_CWD, resolve(cwd, './src')]
const appTitle = env.VITE_APP_TITLE || env.VITE_APP_NAME || env.npm_package_name
const mdi = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7/css/materialdesignicons.min.css"/>`

const define = {
  'import.meta.env.VITE_APP_VER': JSON.stringify(env.npm_package_version),
  'import.meta.env.VITE_APP_MDI': JSON.stringify(mdi)
}

export const viteConfig = (options = {}) => {
  const { server: { https = true } = {}, viteConfigOptions = {} } = options
  return ({ mode = '' }) => {
    const isDev = mode === 'development'
    if (isDev) env.TAILWIND_MODE = 'watch'

    const defaultConfig = {
      base: env.VITE_APP_BASE || '/',
      define,
      server: {
        port: 3000,
        proxy: {},
        fs: { strict: false },
        host: true,
        https
      },
      resolve: {
        alias: {
          '~': pathSrc + '/',
          // bugfix: crypto-addr-codec@0.1.7
          'crypto-addr-codec': 'crypto-addr-codec/dist/index.js'
        }
      },
      build: {
        ...(isDev ? { minify: false, sourcemap: 'inline' } : {}),
        rollupOptions: {
          // external: /^lit/
          // input: {
          //   main: resolve(cwd, 'index.html')
          // }
        }
      },
      css: {
        devSourcemap: true,
        modules: { generateScopedName: '[hash:base64:6]' }
      },
      plugins: [
        ...(https ? [mkcert()] : []),
        ...(isDev ? [] : [(minifyHTMLLiterals.default ?? minifyHTMLLiterals)()]),
        ...(viteConfigOptions.splitChunk === false ? [] : [splitVendorChunkPlugin()]),
        ...(viteConfigOptions.html === false
          ? []
          : [
              createHtmlPlugin({
                inject: {
                  data: {
                    HEAD: `<meta charset="UTF-8" />
                <link rel="icon" href="/favicon.ico" />
                <meta
                  name="viewport"
                  content="width=device-width,user-scalable=0,initial-scale=1,maximum-scale=1,minimal-ui,viewport-fit=cover"
                />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="${env.VITE_APP_FG}" />
                <meta name="apple-mobile-web-app-title" content="${appTitle}" />
                <meta name="application-name" content="${appTitle}" />
                <meta name="msapplication-TileColor" content="${env.VITE_APP_BG}" />
                <meta name="theme-color" content="${env.VITE_APP_BG}" />
                <title>${appTitle}</title>
                <meta name="description" content="${env.VITE_APP_DESC}" />
                <meta name="og:type" content="website" />
                ${mdi}
                <script type="module" src="/src/main.ts"></script>
              `,
                    BODY: `
              <app-root></app-root>
              ${
                isDev || !env.VITE_APP_GA
                  ? ''
                  : `<script async src="https://www.googletagmanager.com/gtag/js?id=${env.VITE_APP_GA}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config', '${env.VITE_APP_GA}')</script>`
              }
              `
                  }
                },
                minify: true
              })
            ]),
        ...(isDev || viteConfigOptions.copies
          ? viteConfigOptions.copies ?? []
          : [
              viteStaticCopy({
                targets: [
                  // Github Pages
                  {
                    src: 'dist/index.html',
                    dest: './',
                    rename: '404.html'
                  },
                  {
                    src: normalizePath(resolve(__dirname, './.nojekyll')),
                    dest: './'
                  }
                ]
              })
            ]),
        ...(viteConfigOptions.pwa === false
          ? []
          : [
              VitePWA({
                // selfDestroying: true,
                registerType: 'autoUpdate',
                manifest: {
                  name: env.VITE_APP_TITLE || env.npm_package_displayName,
                  short_name: env.VITE_APP_NAME,
                  lang: 'en',
                  background_color: env.VITE_APP_BG
                }
              })
            ]),
        ...(viteConfigOptions.legacy === false
          ? []
          : [
              //TODO: Disabled for `BigInt` error (@vitejs/plugin-legacy@5.2.0)
              // legacy({
              //   polyfills: ['web.url', 'es.object.from-entries']
              // })
            ])
      ],
      optimizeDeps: {
        include: []
      }
    }
    // options (shallow merge)
    const merge = (src, dest) => {
      for (var key in dest) {
        if (key === 'viteConfigOptions') continue
        let [vSrc, vDest] = [src[key], dest[key]]
        if (vSrc && Array.isArray(vSrc)) {
          vDest.forEach((dest) => {
            const found = vSrc.some((r) => r == dest)
            if (!found) vSrc.push(dest)
          })
        } else if (vSrc && typeof vSrc === 'object') merge(vSrc, vDest)
        else src[key] = vDest
      }
    }
    merge(defaultConfig, options)
    return defineConfig(defaultConfig)
  }
}

export default { viteConfig }
