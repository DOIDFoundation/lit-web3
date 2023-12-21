// Usage:
// 1. import directly
// 2. in `vite.config`, `resolve: { alias: { stream: resolve(__dirname, '../../packages/node-shims', 'stream.js') } }`
export { default as process } from './process'
export { Stream } from './stream'
export { default as util } from './util'
export { Buffer } from './buffer'
