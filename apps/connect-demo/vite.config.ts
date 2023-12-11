import { viteConfig } from '@lit-web3/dui/src/shared/vite.config.cjs'

export default ({ mode = '' }) => {
  return viteConfig({ server: { port: 4809 } })({ mode })
}
