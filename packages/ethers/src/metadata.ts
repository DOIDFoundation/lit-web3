import http from '@lit-web3/core/src/http'
import { normalizeUri } from '@lit-web3/core/src/uri'

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
  try {
    const uri = normalizeUri(tokenURI)
    meta = await http.get(uri)
  } catch (e) {}
  return normalize(meta)
}
