import { viteConfig } from '@lit-web3/dui/src/shared/vite.config.cjs'

export default ({ mode = '' }) => {
  return viteConfig({
    server: {
      https: false, port: 4811, proxy: {
        '/jsonrpc': {
          target: 'http://54.221.168.235:8556',
          changeOrigin: true,
          cookieDomainRewrite: 'localhost'
        }
      }
    }
  })({ mode })
}
