import safeDecodeURIComponent from 'safe-decode-uri-component'
export { safeDecodeURIComponent }

// Just encode reserved characters
export const safeEncodeURIComponent = (s: string) => s.replaceAll(/[;/?:@&=+$,#]/g, (r) => encodeURIComponent(r))

export const normalizeUri = (uri = '') => {
  let _uri = uri
  // /^(https?|base64):/
  if (/^(ipfs):/.test(uri)) {
    _uri = `https://ipfs.io/ipfs/${uri.replace(/^(ipfs):\/\//, '')}`
  }
  return _uri
}
