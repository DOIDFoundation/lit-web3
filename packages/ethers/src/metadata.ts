import http from '@lit-web3/core/src/http'
import { normalizeUri } from '@lit-web3/core/src/uri'
import { useStorage } from './useStorage'

export const normalize = (data: GraphRecord): Meta => {
  const meta = {
    ...data,
    name: data.name ?? '',
    image: normalizeUri(data.image_url || data.image || '')
  }
  return meta
}

export const getMetaData = async (tokenURI = ''): Promise<Meta> => {
  let meta: Meta = { name: '' }
  if (!tokenURI) return meta
  // 1. from cache
  const storage = await useStorage(`meta.${tokenURI}`, sessionStorage, true)
  meta = await storage.get()
  if (meta) return meta
  // 2. from tokenURI
  try {
    const uri = normalizeUri(tokenURI)
    meta = normalize(await http.get(uri))
  } catch (e) {}
  if (meta) storage.set(meta)
  return meta
}
