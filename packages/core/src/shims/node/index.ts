// Usage:
// 1. import directly
// 2. in `vite.config`, `resolve: { alias: { stream: resolve(__dirname, '../../packages/core/src/shims/node', 'stream.ts') } }`
import './process'
import Buffer from './buffer.sync'
import './stream'
import './util'

export { Buffer }
