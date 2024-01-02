import viteAppConfig from '@lit-web3/base/vite.config.app'

export default ({ mode = '' }) => {
  return viteAppConfig({
    server: {
      https: false,
      port: 4812
    }
  })({ mode })
}
