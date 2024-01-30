import { randomBytes, toUtf8Bytes, toBeArray, uuidV4, encodeBase58, decodeBase58, toUtf8String, sha256 } from 'ethers'

// Generate a client-keep uuid
let uuidCached = ''
export const uuid = () => {
  if (uuidCached) return uuidCached
  const stored = localStorage.getItem('uuid')
  if (stored && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(stored))
    return stored
  const generated = uuidV4(randomBytes(32))
  localStorage.setItem('uuid', generated)
  return generated
}

// string to bs58
export const wrap = (s: string) => encodeBase58(toUtf8Bytes(s))
// bs58 to string
export const unwrap = (wrapped: string) => toUtf8String(toBeArray(decodeBase58(wrapped)))

// address@domain to gid
export const toGid = (address: string, domain: string) =>
  wrap(sha256(toUtf8Bytes(`${address}@${domain}`))).substring(0, 22)
