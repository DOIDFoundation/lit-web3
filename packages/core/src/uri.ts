import safeDecodeURIComponent from 'safe-decode-uri-component'
export { safeDecodeURIComponent }

// Just encode reserved characters
export const safeEncodeURIComponent = (s: string) => s.replaceAll(/[;/?:@&=+$,#]/g, (r) => encodeURIComponent(r))

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<(?:.|\n)*?>/gm, '') // Drop HTML tags
    .replace(/[$\-_.+!*'(), "<>#%{}|^~[\]` ;/?:@=&]/g, ' ') // Drop special, unsafe and reserved characters
    .trim()
    .replace(/\s+/g, '-')

export const normalizeUri = (uri = '') => {
  if (/^(ipfs):/.test(uri)) return `https://ipfs.io/ipfs/${uri.replace(/^(ipfs):\/\//, '')}`
  // /^(https?|base64):/
  return uri
}

export const isInstantUri = (uri = ''): boolean => /^(data|blob):/.test(uri)

export const getExt = (uri: string) => {
  if (!uri) return ''
  const [, ext] = new URL(uri).pathname.match(/(\w+)$/) ?? []
  return ext
}

export const instantMimeType = (uri = ''): string => (uri.match(/^data:(.+);/) || [])[1]
