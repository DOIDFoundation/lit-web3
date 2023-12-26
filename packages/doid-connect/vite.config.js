import viteLibConfig, { resolveSrc } from '@doid/ui-core/vite.config.lib'

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
