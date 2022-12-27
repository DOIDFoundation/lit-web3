import bufferPolyfill from './node.polyfill'

export default async () => {
  await bufferPolyfill()
  const { formatsByName, formatsByCoinType } = await import('@ensdomains/address-encoder/lib/index.umd.js')
  return { formatsByName, formatsByCoinType }
}
