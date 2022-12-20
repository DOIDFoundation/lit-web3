const { resolve } = require('path')
const glob = require('glob')
const { defineConfig, splitVendorChunkPlugin } = require('vite')
const { VitePWA } = require('vite-plugin-pwa')
const { createHtmlPlugin } = require('vite-plugin-html')
const { viteStaticCopy } = require('vite-plugin-static-copy')
const { default: minifyHTMLLiterals } = require('rollup-plugin-minify-html-literals')
const { config } = require('dotenv')
// Polyfills
const { default: legacy } = require('@vitejs/plugin-legacy')
const { default: mkcert } = require('vite-plugin-mkcert')
// Env
config()

const { env } = process
const appTitle = env.VITE_APP_TITLE || env.VITE_APP_NAME || env.npm_package_name
const mdi = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.1.96/css/materialdesignicons.min.css"/>`

const define = {
  'import.meta.env.VITE_APP_VER': JSON.stringify(env.npm_package_version),
  'import.meta.env.VITE_APP_MDI': JSON.stringify(mdi)
}

const viteConfig = (options = {}) => {
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
        https: true
      },
      resolve: {
        alias: {
          '@': resolve(process.cwd(), './src')
        }
      },
      build: {
        assetsDir: '_assets',
        rollupOptions: {
          // external: /^lit/
          // input: {
          //   main: resolve(process.cwd(), 'index.html')
          // }
        }
      },
      css: {
        devSourcemap: true,
        modules: { generateScopedName: '[hash:base64:6]' }
      },
      plugins: [
        mkcert(),
        minifyHTMLLiterals(),
        splitVendorChunkPlugin(),
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
        }),
        ...(isDev
          ? []
          : [
              viteStaticCopy({
                // targets: [
                //   {
                //     src: 'dist/index.html',
                //     dest: './',
                //     rename: '404.html'
                //   },
                //   {
                //     src: 'dist/index.html',
                //     dest: './passes/'
                //   }
                // ]
                targets: glob
                  .sync('./src/views/*/**/')
                  .map((r) => r.replace(/^\.\/src\/views/, '.'))
                  .map((dest) => ({ src: 'dist/index.html', dest }))
              })
            ]),
        VitePWA({
          // selfDestroying: true,
          registerType: 'autoUpdate',
          manifest: {
            name: env.VITE_APP_TITLE,
            short_name: env.VITE_APP_NAME,
            lang: 'en',
            background_color: env.VITE_APP_BG
          }
        }),
        legacy({
          polyfills: ['es.object.from-entries']
        })
      ]
    }
    // options (shallow merge)
    for (var key in options) {
      Object.assign(defaultConfig[key], Object.assign({}, defaultConfig[key], options[key]))
    }
    return defineConfig(defaultConfig)
  }
}

module.exports = { viteConfig }
