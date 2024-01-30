import viteAppConfig from '@lit-web3/base/vite.config.app'

export default ({ mode = '' }) => {
  return viteAppConfig({ server: { port: 4811 } })({ mode })
}
