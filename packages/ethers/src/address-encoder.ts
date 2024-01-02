import '@doid/node-buffer'

let promise: any
export default async () => {
  if (promise) return promise
  return (promise = new Promise(async (resolve) => {
    const { formatsByName, formatsByCoinType } = await import('@ensdomains/address-encoder')
    resolve({ formatsByName, formatsByCoinType })
  }))
}
