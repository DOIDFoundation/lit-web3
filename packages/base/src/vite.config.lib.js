// For build component library
import { viteBaseConfig, mergeOptions, pathSrc } from './vite.config.base.js'
import fg from 'fast-glob'
import dts from 'vite-plugin-dts'

export { resolveSrc } from './vite.config.base.js'
const getEntries = () => {
  const entries = fg.sync('./src/**/*.(ts|js)', { absolute: false }).map((filePath) => {
    const [key] = filePath.match(/(?<=src\/).*$/) ?? []
    const fileName = key.replace(/\.[^.]*$/, '')
    return [fileName, filePath]
  })
  return Object.fromEntries(entries)
}

export const viteLibConfig = (options = {}) => {
  return ({ mode = '' }) => {
    const libConfig = {
      build: {
        // [eg.](https://vitejs.dev/guide/build#library-mode)
        // lib: {
        //   entry: resolveSrc('myLib.ts'),
        //   name: 'myLib'，
        //   formats: ['es]
        // },
        lib: options.lib ?? {
          entry: getEntries(),
          formats: ['es']
        },
        rollupOptions: {
          external: [] // eg. ['lit', 'ethers']
        }
      },
      plugins: [dts({ entryRoot: pathSrc })]
    }
    mergeOptions(libConfig, options)
    return viteBaseConfig(libConfig)({ mode })
  }
}

export default viteLibConfig
