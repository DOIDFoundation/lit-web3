import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import minifyHTMLLiterals from 'rollup-plugin-minify-html-literals'

// Env
import { config } from 'dotenv'
config()

export const cwd = process.cwd()
export const __dirname = dirname(fileURLToPath(import.meta.url))

export const { env } = process
export const [pathRoot, pathSrc] = [env.INIT_CWD, resolve(cwd, './src')]
export const appTitle = env.VITE_APP_TITLE || env.VITE_APP_NAME || env.npm_package_name
export const resolveSrc = (...args) => resolve(...[pathSrc, ...args])
const mdi = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7/css/materialdesignicons.min.css"/>`

export const define = {
  'import.meta.env.VITE_APP_VER': JSON.stringify(env.npm_package_version),
  'import.meta.env.VITE_APP_MDI': JSON.stringify(mdi)
}

// shallow merge config options
export const mergeOptions = (src, dest) => {
  for (var key in dest) {
    if (['viteConfigOptions'].includes(key)) continue
    let [vSrc, vDest] = [src[key], dest[key]]
    if (vSrc && Array.isArray(vSrc)) {
      if (Array.isArray(vSrc)) {
        if (vDest.length) {
          vDest.forEach((dest) => {
            const found = vSrc.some((r) => r == dest)
            if (!found) vSrc.push(dest)
          })
        } else src[key] = vDest
      } else src[key] = vDest
    } else if (vSrc && typeof vSrc === 'object') mergeOptions(vSrc, vDest)
    else src[key] = vDest
  }
}

export const viteBaseConfig = (options = {}) => {
  const { viteConfigOptions = {} } = options
  return ({ mode = '' }) => {
    const isDev = mode === 'development'
    if (isDev) env.TAILWIND_MODE = 'watch'

    const defaultConfig = {
      base: env.VITE_APP_BASE || '/',
      define,
      resolve: {
        alias: {
          '~': pathSrc + '/'
        }
      },
      build: {
        ...(isDev ? { minify: false, sourcemap: 'inline' } : {}),
        rollupOptions: {}
      },
      css: {
        devSourcemap: true,
        modules: { generateScopedName: '[hash:base64:6]' }
      },
      plugins: [
        ...(isDev ? [] : [(minifyHTMLLiterals.default ?? minifyHTMLLiterals)()]),
        ...(viteConfigOptions.splitChunk === false ? [] : [splitVendorChunkPlugin()])
      ],
      optimizeDeps: {
        include: []
      }
    }
    mergeOptions(defaultConfig, options)
    return defineConfig(defaultConfig)
  }
}

export default viteBaseConfig
