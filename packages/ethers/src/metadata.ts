import http from '@lit-web3/core/src/http'
import { normalizeUri } from '@lit-web3/core/src/uri'
import { useStorage } from './useStorage'
import { getChainId } from './useBridge'
import { getOpenseaUri } from './constants/opensea'
import slugify from '@lit-web3/core/src/slugify'
import { sleep, nowTs } from './utils'
import { safeEncodeURIComponent } from '@lit-web3/core/src/uri'

export const normalize = (data: GraphRecord): Meta => {
  const { background_color, owner = '', external_link, asset_contract, collection } = data
  const img = data.image_url || data.image || ''
  const name = data.name || collection?.name
  const meta = {
    name,
    description: data.description || collection?.description,
    slug: slugify(name),
    image: normalizeUri(data.image_preview_url || data.image_thumbnail_url || img),
    raw: normalizeUri(data.image_original_url || img),
    creator: data.creator?.address,
    owner,
    external_link,
    background_color
  }
  return meta
}
// meta cache (1d)
const storageOptions = { store: sessionStorage, withoutEnv: true, ttl: 86400000 }

let pendingTs = 0
// OpenSea only accept 1 req/sec.
export const throttle = async (uri: string): Promise<Meta> => {
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
    }, Math.max(nowTs() - pendingTs, 1024))
  } catch (err) {
    pendingTs = 0
  }
  return meta
}
export const getMetaDataByOpenSea = async ({ address = '', tokenID = '' } = <NFTToken>{}): Promise<Meta> => {
  let meta: Meta = {}
  // 1. from cache
  const storage = await useStorage(`meta.${address}.${tokenID}`, storageOptions)
  meta = await storage.get()
  if (meta) return meta
  // 2. from api
  try {
    meta = normalize(await throttle(`${getOpenseaUri('api')}/${address}/${tokenID}/`))
    meta.origin = 'opensea'
    if (meta) storage.set(meta)
  } catch (e) {}
  return meta
}

export const getMetaDataByTokenURI = async (tokenURI = ''): Promise<Meta> => {
  let meta: Meta = {}
  if (!tokenURI) return meta
  // 1. from cache
  const storage = await useStorage(`meta.${tokenURI}`, storageOptions)
  meta = await storage.get()
  if (meta) return meta
  // 2. from tokenURI
  try {
    const uri = normalizeUri(tokenURI)
    meta = normalize(await http.get(uri))
    meta.origin = 'ipfs'
    if (meta) storage.set(meta)
  } catch (e) {}
  return meta
}

export const getMetaData = async (token: NFTToken): Promise<Meta> => {
  let meta: Meta | undefined = undefined
  const { tokenURI, address, tokenID, doid, minter } = token
  // 1. by cache
  if (tokenURI) {
    meta = await (await useStorage(`meta.${tokenURI}`, storageOptions)).get()
  }
  if (!meta) meta = await (await useStorage(`meta.${address}.${tokenID}`, storageOptions)).get()
  // 2. by OpenSea
  if (!meta && address && tokenID) {
    meta = await getMetaDataByOpenSea(token)
  }
  // 3. by tokenURI
  if (!meta) meta = await getMetaDataByTokenURI(tokenURI)
  // Validate slug
  if (doid) {
    try {
      const chainId = await getChainId()
      const addersses = await http.get(
        `https://raw.githubusercontent.com/DOIDFoundation/doid-slugs/main/${chainId}/${safeEncodeURIComponent(doid)}/${
          meta.slug
        }.txt`
      )
      meta.sync = addersses.includes(minter)
    } catch (err) {}
  }
  return meta ?? {}
}
