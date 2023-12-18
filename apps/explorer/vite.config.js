import { viteConfig } from '@lit-web3/dui/src/shared/vite.config.js'

export default ({ mode = '' }) => {
  return viteConfig({
    server: {
      https: false,
      port: 4812
    }
  })({ mode })
}
