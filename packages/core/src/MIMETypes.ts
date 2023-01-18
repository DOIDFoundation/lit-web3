import { getExt, getDataMimeType } from './uri'

// Image
export const Images = [
  { ext: 'gif', mimeType: 'image/gif' },
  { ext: 'jpg', mimeType: 'image/jpeg' },
  { ext: 'jpeg', mimeType: 'image/jpeg' },
  { ext: 'png', mimeType: 'image/png' },
  { ext: 'svg', mimeType: 'image/svg+xml' },
  { ext: 'webp', mimeType: 'image/webp' }
]
export const ImageExts = Images.map((r) => r.ext)
export const ImageMimeTypes = Images.map((r) => r.mimeType)
// Video
export const Videos = [
  { ext: 'mp4', mimeType: 'video/mp4' },
  { ext: 'webm', mimeType: 'video/webm' }
]
export const VideoExts = Videos.map((r) => r.ext)
export const VideoMimeTypes = Videos.map((r) => r.mimeType)
// Threed
export const Threeds = [
  { ext: 'gltf', mimeType: 'model/gltf-binary' },
  { ext: 'glb', mimeType: 'model/gltf-binary' }
]
export const ThreedExts = Threeds.map((r) => r.ext)
export const ThreedMimeTypes = Threeds.map((r) => r.mimeType)
// Audio
export const Audios = [
  { ext: 'mp3', mimeType: 'audio/mpeg' },
  { ext: 'ogg', mimeType: 'audio/ogg' },
  { ext: 'wav', mimeType: 'audio/wav' }
]
export const AudioExts = Audios.map((r) => r.ext)
export const AudioMimeTypes = Audios.map((r) => r.mimeType)

export const isImage = (uri = ''): boolean =>
  ImageExts.includes(getExt(uri)) || ImageMimeTypes.includes(getDataMimeType(uri))
export const isVideo = (uri = ''): boolean =>
  VideoExts.includes(getExt(uri)) || VideoMimeTypes.includes(getDataMimeType(uri))
export const isThreed = (uri = ''): boolean =>
  ThreedExts.includes(getExt(uri)) || ThreedMimeTypes.includes(getDataMimeType(uri))
export const isAudio = (uri = ''): boolean =>
  AudioExts.includes(getExt(uri)) || AudioMimeTypes.includes(getDataMimeType(uri))

export enum NFTType {
  audio = 'audio',
  image = 'image',
  threed = 'threed',
  video = 'video'
}
export const getNFTType = (uri = ''): keyof typeof NFTType | undefined => {
  if (isVideo(uri)) return NFTType.video
  if (isAudio(uri)) return NFTType.audio
  if (isThreed(uri)) return NFTType.threed
  if (isImage(uri)) return NFTType.image
  return
}
