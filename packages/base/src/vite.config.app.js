// For build web apps
import { viteBaseConfig, mergeOptions, resolveDir, env, mdi } from './vite.config.base.js'

import { normalizePath } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteStaticCopy } from 'vite-plugin-static-copy'
// Polyfills
import legacy from '@vitejs/plugin-legacy'
import mkcert from 'vite-plugin-mkcert'

export { resolveSrc } from './vite.config.base.js'

const appTitle = env.VITE_APP_TITLE || env.VITE_APP_NAME || env.npm_package_name

export const viteAppConfig = (options = {}) => {
  const { server: { https = true } = {}, viteConfigOptions = {} } = options
  return ({ mode = '' }) => {
    const isDev = mode === 'development'
    const appConfig = {
      server: {
        proxy: {},
        fs: { strict: false },
        host: true,
        https
      },
      plugins: [
        ...(https ? [mkcert()] : []),
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
                    src: normalizePath(resolveDir('./.nojekyll')),
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
      ]
    }
    mergeOptions(appConfig, options)
    return viteBaseConfig(appConfig)({ mode })
  }
}

export default viteAppConfig
