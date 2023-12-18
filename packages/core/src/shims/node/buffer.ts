// To use `importScript`, plese use '/buffer.sync' instead
let promise: any
export default () => {
  return (
    promise ??
    (promise = new Promise(async (resolve) => {
      if (!('Buffer' in globalThis))
        Object.defineProperty(globalThis, 'Buffer', { value: (await import('./buffer.es6.js')).Buffer })
      resolve(globalThis.Buffer)
    }))
  )
}
