let promise: any
export default async () => {
  if (globalThis.Buffer) return globalThis.Buffer
  if (promise) return promise
  return (promise = new Promise(async (resolve) => {
    resolve((globalThis.Buffer = (await import('buffer')).Buffer))
  }))
}
