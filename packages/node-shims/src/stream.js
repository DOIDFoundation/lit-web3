export { Readable, Writable, Transform, Duplex } from 'stream'
import Stream from 'stream'

if (!('stream' in globalThis)) Object.defineProperty(globalThis, 'stream', { value: Stream })

export { Stream }
export default Stream
