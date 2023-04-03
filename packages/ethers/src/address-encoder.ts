import shimBuffer from '@lit-web3/core/src/shims/node/buffer'

let promise: any
export default async () => {
  if (promise) return promise
  return (promise = new Promise(async (resolve) => {
    await shimBuffer()
    const { formatsByName, formatsByCoinType } = await import('@ensdomains/address-encoder/lib/index.umd.js')
    resolve({ formatsByName, formatsByCoinType })
  }))
}
