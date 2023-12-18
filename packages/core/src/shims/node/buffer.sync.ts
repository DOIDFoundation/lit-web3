import { Buffer } from './buffer.es6.js'
if (!('Buffer' in globalThis)) Object.defineProperty(globalThis, 'Buffer', { value: Buffer })
export { Buffer }
export default globalThis.Buffer
