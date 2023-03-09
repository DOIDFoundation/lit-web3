import './process'
import { Buffer } from 'buffer'
globalThis.Buffer ?? (globalThis.Buffer = Buffer)
if (!('Buffer' in process)) Object.defineProperty(process, 'Buffer', { value: globalThis.Buffer })
export default globalThis.Buffer
