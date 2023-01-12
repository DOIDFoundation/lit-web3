import safeDecodeURIComponent from 'safe-decode-uri-component'
export { safeDecodeURIComponent }

// Just encode reserved characters
export const safeEncodeURIComponent = (s: string) =>
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
