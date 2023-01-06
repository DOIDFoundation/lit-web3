import safeDecodeURIComponent from 'safe-decode-uri-component'
export { safeDecodeURIComponent }

// Just encode reserved characters
export const safeEncodeURIComponent = (s: string) => s.replaceAll(/[;/?:@&=+$,#]/g, (r) => encodeURIComponent(r))

export const normalizeUri = (uri = '') => {
  if (/^(ipfs):/.test(uri)) return `https://ipfs.io/ipfs/${uri.replace(/^(ipfs):\/\//, '')}`
  // /^(https?|base64):/
  return uri
}
