import viteLibConfig, { resolveSrc } from '@lit-web3/base/vite.config.lib'

export default ({ mode = '' }) => {
  return viteLibConfig({
    build: {
      lib: {
        entry: resolveSrc('index.ts'),
        fileName: 'index',
        formats: ['es']
      }
    }
  })({ mode })
}
