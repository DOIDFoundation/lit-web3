import { Buffer as shimBuffer } from 'buffer'
if (!('Buffer' in globalThis)) Object.defineProperty(globalThis, 'Buffer', { value: shimBuffer })
export default globalThis.Buffer
