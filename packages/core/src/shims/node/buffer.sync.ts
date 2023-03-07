import './process'
import { Buffer } from 'buffer'
globalThis.Buffer ?? (globalThis.Buffer = Buffer)
export default globalThis.Buffer
