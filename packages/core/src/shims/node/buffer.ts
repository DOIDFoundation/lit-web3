// To use `importScript`, plese use '/buffer.sync' instead
let promise: any
export default () => {
  return (
    promise ??
    (promise = new Promise(async (resolve) =>
      resolve(globalThis.Buffer ?? (globalThis.Buffer = (await import('buffer')).Buffer))
    ))
  )
}
