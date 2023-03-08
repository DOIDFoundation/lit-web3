export { Readable, Writable, Transform, Duplex } from 'readable-stream'
import Stream from 'readable-stream'
if (!('stream' in globalThis)) Object.defineProperty(globalThis, 'stream', { value: Stream })
if (typeof process?.stream === 'undefined') Object.defineProperty(process, 'stream', { value: Stream })
export default Stream
