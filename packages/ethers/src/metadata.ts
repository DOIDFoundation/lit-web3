import http from '@lit-web3/core/src/http'
import { normalizeUri, isInstantUri } from '@lit-web3/core/src/uri'
import { useStorage } from './useStorage'
import { getChainId } from './useBridge'
import { getOpenseaUri } from './constants/opensea'
import slugify from '@lit-web3/core/src/slugify'
import { sleep, nowTs } from './utils'
import { safeEncodeURIComponent } from '@lit-web3/core/src/uri'

export const normalize = (data: Record<string, any>): Meta => {
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

export const getMetaDataByOpenSea = async ({ address = '', tokenID = '' } = <NFTToken | Coll>{}): Promise<Meta> => {
  let meta: Meta | undefined = undefined
  // 1. from cache
  const storage = await useStorage(`meta.${address}.${tokenID}`, storageOpt)
  meta = await storage.get()
  // 2. from api
  if (!meta) {
    try {
      meta = normalize(await throttle(`${getOpenseaUri('api')}/${address}/${tokenID}/`))
      if (meta) storage.set(meta)
    } catch {}
  }
  return meta ?? {}
}

export const getMetaDataByTokenURI = async (tokenURI = ''): Promise<Meta> => {
  let meta: Meta | undefined = undefined
  if (!tokenURI) return {}
  // 0. instant data
  if (isInstantUri(tokenURI)) meta = normalize(await http.get(tokenURI))
  // 1. from cache
  const storage = await useStorage(`meta.${tokenURI}`, storageOpt)
  if (!meta) meta = await storage.get()
  // 2. from tokenURI
  if (!meta) {
    try {
      meta = normalize(await http.get(normalizeUri(tokenURI)))
      if (meta) storage.set(meta)
    } catch {}
  }
  return meta ?? {}
}

export const getMetaData = async (token: NFTToken | Coll): Promise<Meta> => {
  let meta: Meta | undefined = undefined
  const { tokenURI, address, tokenID, doid, minter } = token
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
  // Validate meta by slug
  if (meta && doid) {
    try {
      const chainId = await getChainId()
      const addersses = await http.get(
        `https://raw.githubusercontent.com/DOIDFoundation/doid-slugs/main/${chainId}/${safeEncodeURIComponent(doid)}/${
          meta.slug
        }.txt`
      )
      meta.sync = addersses.includes(minter)
    } catch {}
  }
  return meta ?? {}
}
