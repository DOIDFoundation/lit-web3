import http from '@lit-web3/core/src/http'
import { normalizeUri, isInstantUri } from '@lit-web3/core/src/uri'
import { useStorage } from '../useStorage'
import { attachSlug } from '../DOIDParser'
import { storageOpt, normalize } from './shared'
import { getMetaDataByAPI } from './getMetaDataByAPI'

export const getMetaDataByTokenURI = async (tokenURI = ''): Promise<Meta> => {
  let meta: Meta | undefined
  if (!tokenURI) return {}
  // 0. instant data
  if (isInstantUri(tokenURI)) meta = await normalize(await http.get(tokenURI))
  // 1. from cache
  const storage = await useStorage(`meta.${tokenURI}`, storageOpt)
  if (!meta) meta = await storage.get()
  // 2. from tokenURI
  if (!meta) {
    try {
      meta = await normalize(await http.get(normalizeUri(tokenURI)))
      if (meta.name && meta.image) storage.set(meta)
    } catch {}
  }
  return meta ?? {}
}

export const getMetaData = async (token: NFTToken | Coll): Promise<Meta> => {
  let meta: Meta | undefined
  const { tokenURI, address, tokenID } = token
  // 0. instant data
  if (isInstantUri(tokenURI)) meta = await getMetaDataByTokenURI(tokenURI)
  // 1. by cache
  if (!meta && tokenURI) meta = await (await useStorage(`meta.${tokenURI}`, storageOpt)).get()
  if (!meta) meta = await (await useStorage(`meta.${address}.${tokenID}`, storageOpt)).get()
  // 2. by openAPI
  if (!meta && address && tokenID) {
    meta = await getMetaDataByAPI(token)
  }
  // 3. by tokenURI
  if (!meta && tokenURI) meta = await getMetaDataByTokenURI(tokenURI)
  // Attach slug
  if (meta) {
    token.meta = meta
    attachSlug(token as NFTToken)
  }
  return meta ?? {}
}
