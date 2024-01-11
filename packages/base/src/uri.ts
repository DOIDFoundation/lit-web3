export const normalizeUri = (uri = '') => {
  if (/^(ipfs):/.test(uri)) return `https://ipfs.io/ipfs/${uri.replace(/^(ipfs):\/\//, '')}`
  // /^(https?|base64):/
  return uri
}

export const isInstantUri = (uri = ''): boolean => /^(data|blob):/.test(uri)

export const getExt = (uri: string) => {
  if (!uri) return ''
  let url
  try {
    url = new URL(uri)
  } catch {}
  if (!url) return ''
  const [, ext] = new URL(url).pathname.match(/(\w+)$/) ?? []
  return ext
}

export const instantMimeType = (uri = ''): string => (uri.match(/^data:(.+);/) || [])[1]
