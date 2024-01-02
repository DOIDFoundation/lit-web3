import viteAppConfig from '@lit-web3/base/vite.config.app'

export default ({ mode = '' }) => {
  return viteAppConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setup.ts'],
      deps: { inline: ['@lit-web3/base/state'] }
    },
    server: { port: 4799 }
  })({ mode })
}
