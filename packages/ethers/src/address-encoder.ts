import '@doid/node-shims/buffer'

let promise: any
export default async () => {
  if (promise) return promise
  return (promise = new Promise(async (resolve) => {
    const { formatsByName, formatsByCoinType } = await import('@ensdomains/address-encoder/lib/index.umd.js')
    resolve({ formatsByName, formatsByCoinType })
  }))
}
