// For build web apps
import { viteBaseConfig, mergeOptions, pathSrc } from './vite.config.base.js'
import dts from 'vite-plugin-dts'

export { resolveSrc } from './vite.config.base.js'

export const viteLibConfig = (options = {}) => {
  return ({ mode = '' }) => {
    const libConfig = {
      build: {
        // [eg.](https://vitejs.dev/guide/build#library-mode)
        // lib: {
        //   entry: resolveSrc('myLib.ts'),
        //   name: 'myLib'，
        //   fileName: 'my-lib'，
        //   formats: ['es]
        // },
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
