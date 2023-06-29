import http from '@lit-web3/core/src/http'
import { fetchNFTType } from '@lit-web3/core/src/MIMETypes'
import { normalizeUri } from '@lit-web3/core/src/uri'
import { sleep, nowTs } from '../utils'

export const normalize = async (data: Record<string, any>): Promise<Meta> => {
  const { background_color, owner = '', external_link = '', asset_contract, collection = {} } = data
  const name: string = data.name || collection.name
  const poster: string =
    data.poster ||
    data.image_preview_url ||
    data.image_thumbnail_url ||
    data.image_url ||
    data.image ||
    data.image_original_url ||
    collection.image_url ||
    ''
  const raw: string = normalizeUri(
    data.raw || data.animation_url || data.animation_original_url || collection.large_image_url || poster
  )
  const meta: Meta = {
    name,
    description: (data.description || collection.description) as string,
    image: normalizeUri(poster),
    raw,
    creator: data.creator?.address || data.creator,
    owner,
    external_link: data.external_link || data.external_uri,
    background_color,
    mediaType: raw ? await fetchNFTType(raw) : ''
  }
  return meta
}

// meta cache (1d)
export const storageOpt = { store: sessionStorage, withoutEnv: true, ttl: 86400000 }

const pending: Record<string, number> = {}
// OpenSea only accept 1 req/sec.
export const throttle = async (provider: string, uri: string, interval = 1024): Promise<Meta> => {
  let meta: Meta = {}
  if (pending[provider]) {
    await sleep(50)
    return await throttle(provider, uri)
  }
  pending[provider] = nowTs()
  try {
    meta = await http.get(uri)
    setTimeout(() => {
      pending[provider] = 0
    }, Math.max(nowTs() - pending[provider], interval))
  } catch (err: any) {
    if (err.code === 403) throw err
    pending[provider] = 0
  }
  return meta
}
