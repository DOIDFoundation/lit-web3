import http from '@lit-web3/core/src/http'
import { normalizeUri } from '@lit-web3/core/src/uri'

declare interface MetaData extends Meta {
  image?: string
}

export const getMetaData = async (tokenURI = '') => {
  let meta: MetaData = { name: '' }
  const uri = normalizeUri(tokenURI)
  try {
    if (uri) meta = await http.get(uri)
  } catch (e) {
    console.error(e)
  }
  return meta
}
