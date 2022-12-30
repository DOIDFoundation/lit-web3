import bufferPolyfill from './node.polyfill'

let promise: any
export default async () => {
  if (promise) return promise
  return (promise = new Promise(async (resolve) => {
    await bufferPolyfill()
    const { formatsByName, formatsByCoinType } = await import('@ensdomains/address-encoder/lib/index.umd.js')
    resolve({ formatsByName, formatsByCoinType })
  }))
}
