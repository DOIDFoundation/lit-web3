import http from '@lit-web3/core/src/http'
import { fetchNFTType } from '@lit-web3/core/src/MIMETypes'
import { normalizeUri, isInstantUri } from '@lit-web3/core/src/uri'
import { useStorage } from './useStorage'
import { getOpenseaUri } from './constants/opensea'
import { sleep, nowTs } from './utils'
import { attachSlug } from './DOIDParser'

export const normalize = async (data: Record<string, any>): Promise<Meta> => {
  const { background_color, owner = '', external_link = '', asset_contract, collection } = data
  const name: string = data.name || collection?.name
  const poster: string =
    data.image_preview_url || data.image_thumbnail_url || data.image_url || data.image || data.image_original_url || ''
  const raw: string = data.animation_url || data.animation_original_url || poster
  let mediaType = await fetchNFTType(raw)
  const meta: Meta = {
    name,
    description: (data.description || collection?.description) as string,
    image: normalizeUri(poster),
    raw: normalizeUri(raw),
    creator: data.creator?.address,
    owner,
    external_link,
    background_color,
    mediaType
  }
  return meta
}
// meta cache (1d)
const storageOpt = { store: sessionStorage, withoutEnv: true, ttl: 86400000 }

let pendingTs = 0
// OpenSea only accept 1 req/sec.
export const throttle = async (uri: string, interval = 1024): Promise<Meta> => {
  let meta: Meta = {}
  if (pendingTs) {
    await sleep(50)
    return await throttle(uri)
  }
  pendingTs = nowTs()
  try {
    meta = await http.get(uri)
    setTimeout(() => {
      pendingTs = 0
    }, Math.max(nowTs() - pendingTs, interval))
  } catch (err) {
    pendingTs = 0
  }
  return meta
}

export const getMetaDataByOpenSea = async (
  { address = '', tokenID = '' } = <NFTToken | Coll>{},
  retry = true
): Promise<Meta> => {
  let meta: Meta | undefined
  // 1. from cache
  const storage = await useStorage(`meta.${address}.${tokenID}`, storageOpt)
  meta = await storage.get()
  // 2. from api
  if (!meta) {
    try {
      const openseaUrl = `${getOpenseaUri('api')}/${address}/${tokenID}/`
      meta = await normalize(await throttle(openseaUrl))
      if (meta.name && meta.image) storage.set(meta)
      else if (!meta.image) {
        // Send a purge request to opensea
        await throttle(`${openseaUrl}?force_update=true`)
        if (retry) {
          await sleep(10000)
          meta = await getMetaDataByOpenSea({ address, tokenID }, false)
        }
      }
    } catch {}
  }
  return meta ?? {}
}

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
  // 2. by OpenSea
  if (!meta && address && tokenID) {
    meta = await getMetaDataByOpenSea(token)
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
