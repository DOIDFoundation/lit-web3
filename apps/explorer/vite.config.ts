import { viteConfig } from '@lit-web3/dui/src/shared/vite.config.cjs'

export default ({ mode = '' }) => {
  return viteConfig({
    server: {
      https: false, port: 4811, proxy: {
        '/jsonrpc': {
          target: 'http://192.168.0.119:8556',
          changeOrigin: true,
          cookieDomainRewrite: 'localhost'
        }
      }
    }
  })({ mode })
}
