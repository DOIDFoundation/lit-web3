import { Writable as WritableStream } from 'readable-stream'
import promiseToCallback from 'promise-to-callback'

class AsyncWritableStream extends WritableStream {
  _asyncWriteFn: any
  constructor(asyncWriteFn: Function, _opts = {}) {
    const opts = { objectMode: true, ..._opts }
    super(opts)
    this._asyncWriteFn = asyncWriteFn
  }

  // write from incoming stream to state
  _write(chunk: any, encoding, callback) {
    promiseToCallback(this._asyncWriteFn(chunk, encoding))(callback)
  }
}

export default function createStreamSink(asyncWriteFn: Function, _opts = {}) {
  return new AsyncWritableStream(asyncWriteFn, _opts)
}
