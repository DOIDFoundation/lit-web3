import { viteConfig } from '@lit-web3/dui/src/shared/vite.config.cjs'

export default ({ mode = '' }) => {
  return viteConfig({
    test: { globals: true, environment: 'jsdom', setupFiles: ['./src/setup.ts'], deps: { inline: ['@lit-app/state'] } },
    server: { port: 4799 }
  })({ mode })
}
