import { getExt, instantMimeType } from './uri'

export enum NFTType {
  audio = 'audio',
  image = 'image',
  threed = 'threed',
  video = 'video'
}
export type MediaType = keyof typeof NFTType | string | undefined

// Image
export const Images = [
  { ext: 'gif', mediaType: NFTType.image, mimeType: 'image/gif' },
  { ext: 'jpg', mediaType: NFTType.image, mimeType: 'image/jpeg' },
  { ext: 'jpeg', mediaType: NFTType.image, mimeType: 'image/jpeg' },
  { ext: 'png', mediaType: NFTType.image, mimeType: 'image/png' },
  { ext: 'svg', mediaType: NFTType.image, mimeType: 'image/svg+xml' },
  { ext: 'webp', mediaType: NFTType.image, mimeType: 'image/webp' }
]
export const ImageExts = Images.map((r) => r.ext)
export const ImageMimeTypes = Images.map((r) => r.mimeType)
// Video
export const Videos = [
  { ext: 'mp4', mediaType: NFTType.video, mimeType: 'video/mp4' },
  { ext: 'webm', mediaType: NFTType.video, mimeType: 'video/webm' }
]
export const VideoExts = Videos.map((r) => r.ext)
export const VideoMimeTypes = Videos.map((r) => r.mimeType)
// Threed
export const Threeds = [
  { ext: 'gltf', mediaType: NFTType.threed, mimeType: 'model/gltf-binary' },
  { ext: 'glb', mediaType: NFTType.threed, mimeType: 'model/gltf-binary' }
]
export const ThreedExts = Threeds.map((r) => r.ext)
export const ThreedMimeTypes = Threeds.map((r) => r.mimeType)
// Audio
export const Audios = [
  { ext: 'mp3', mediaType: NFTType.audio, mimeType: 'audio/mpeg' },
  { ext: 'ogg', mediaType: NFTType.audio, mimeType: 'audio/ogg' },
  { ext: 'wav', mediaType: NFTType.audio, mimeType: 'audio/wav' }
]
export const AudioExts = Audios.map((r) => r.ext)
export const AudioMimeTypes = Audios.map((r) => r.mimeType)
// All
export const NFTs = [...Images, ...Videos, ...Audios, ...Threeds]

export const isImage = (uri = ''): boolean =>
  ImageExts.includes(getExt(uri)) || M2M(instantMimeType(uri)) === NFTType.image
export const isVideo = (uri = ''): boolean =>
  VideoExts.includes(getExt(uri)) || M2M(instantMimeType(uri)) === NFTType.video
export const isThreed = (uri = ''): boolean =>
  ThreedExts.includes(getExt(uri)) || M2M(instantMimeType(uri)) === NFTType.threed
export const isAudio = (uri = ''): boolean =>
  AudioExts.includes(getExt(uri)) || M2M(instantMimeType(uri)) === NFTType.audio

export const getNFTType = (uri = ''): MediaType => {
  const ext = getExt(uri)
  return ext ? findMediaType(ext, 'ext') : M2M(instantMimeType(uri))
}

export const M2M = (mimeType: string) => NFTs.find((r) => r.mimeType === mimeType)?.mediaType

export const findMediaType = (v: string, k: 'ext' | 'mimeType'): MediaType => NFTs.find((r) => r[k] === v)?.mediaType

export const fetchNFTType = async (uri: string): Promise<MediaType> => {
  const { headers } = await fetch(uri, { method: 'HEAD' })
  const contentType = headers.get('content-type')
  if (contentType) return M2M(contentType)
  return
}

export const fetchMediaType = async (uri: string): Promise<MediaType> => {
  let mediaType: MediaType
  const ext = getExt(uri)
  if (ext) mediaType = getNFTType(uri)
  if (!mediaType) mediaType = await fetchNFTType(uri)
  return mediaType
}
