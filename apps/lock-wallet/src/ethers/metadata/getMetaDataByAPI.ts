import { useStorage } from '../useStorage'
import { getScanApi } from '../constants/openScan'
import { sleep } from '../utils'
import { storageOpt, throttle, normalize } from './shared'

export const getMetaDataByAPI = async (token = <NFTToken | Coll>{}, retry = true) => {
  const { address = '', tokenID = '' } = token
  let meta: Meta | undefined
  // 1. from cache
  const storage = await useStorage(`meta.${address}.${tokenID}`, storageOpt)
  meta = await storage.get()
  // 2. from api
  if (!meta?.image) meta = await fromAlchemy(token, retry)
  if (!meta?.image) meta = await fromOpenSea(token, retry)
  // 3. save to cache
  if (meta.name && meta.image) storage.set(meta)
  return meta
}

let alchemyIsUnavailable = sessionStorage.getItem('alchemyIsUnavailable')
export const fromAlchemy = async (
  { address = '', tokenID = '' } = <NFTToken | Coll>{},
  retry = true
): Promise<Meta> => {
  let meta: Meta = {}
  if (alchemyIsUnavailable) return meta
  try {
    const reqUrl = `${getScanApi('alchemy')}/getNFTMetadata?contractAddress=${address}&tokenId=${tokenID}`
    const res: any = await throttle('alchemy', reqUrl)
    const {
      name,
      description,
      raw,
      contract: { openSeaMetadata = {} }
    } = res
    meta = await normalize({
      ...openSeaMetadata,
      name,
      description,
      poster: res.image.thumbnailUrl,
      raw: raw.metadata.image,
      creator: raw.metadata.artist,
      owner: '' // Not provided yet
    })
    if (!meta.image) {
      // Send a purge request
      await throttle('alchemy', `${reqUrl}&refreshCache=true`)
      if (retry) {
        await sleep(10000)
        meta = await fromAlchemy({ address, tokenID }, false)
      }
    }
  } catch (err: any) {
    if (err.code === 403) {
      sessionStorage.setItem('alchemyIsUnavailable', (alchemyIsUnavailable = '1'))
    }
  }
  return meta
}

// TODO: need request a X-API-KEY, and rate limits,
// Pricing:
// OpenSea: 4 gets/s/key
let openseaIsUnavailable = sessionStorage.getItem('openseaIsUnavailable')
export const fromOpenSea = async (
  { address = '', tokenID = '' } = <NFTToken | Coll>{},
  retry = true
): Promise<Meta> => {
  let meta: Meta = {}
  if (openseaIsUnavailable) return meta
  try {
    const reqUrl = `${getScanApi('opensea')}/${address}/${tokenID}/`
    meta = await normalize(await throttle('opensea', reqUrl))
    if (!meta.image) {
      // Send a purge request
      await throttle('opensea', `${reqUrl}?force_update=true`)
      if (retry) {
        await sleep(10000)
        meta = await fromOpenSea({ address, tokenID }, false)
      }
    }
  } catch (err: any) {
    if (err.code === 403) {
      sessionStorage.setItem('openseaIsUnavailable', (openseaIsUnavailable = '1'))
    }
  }
  return meta
}

// nftscan (10,000,000 aws CU/1$)
