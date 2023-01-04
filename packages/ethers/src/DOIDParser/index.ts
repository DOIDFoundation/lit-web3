import { checkDOIDName, wrapTLD } from '../nsResolver/checker'
import { safeDecodeURIComponent, safeEncodeURIComponent } from '@lit-web3/core/src/uri'
import slugify from '@lit-web3/core/src/slugify'

// eg. packages/tests/test/ethers/nameParser.test.ts
export const parseFromString = async (src = ''): Promise<DOIDObject> => {
  const decoded = safeDecodeURIComponent(src)
  const [, DOIDName, , tokenish = ''] = decoded.match(/^([^\/]+?)(\/(.+)?)?$/) ?? []
  // DOIDName
  const DOID = await checkDOIDName(DOIDName)
  let { error, msg, name } = DOID
  // Token
  const [, tokenName = '', , tokenID = '', , sequence = ''] = tokenish.match(/^(.+?)(#(\d+?)(-(\d+)?)?)?$/) ?? []
  const slugName = slugify(tokenName)
  const token: NFTToken = {
    name: tokenName,
    slugName,
    tokenID,
    sequence
  }
  const parsed = { DOID, name, token, error, msg }
  const val = stringify(parsed)
  const uri = stringify(parsed, { encode: true })
  return { ...parsed, val, uri, equal: decoded === val }
}

export const getKeyFromRouter = (name = '', tokenName = '', hash = '') =>
  `${name}${tokenName ? `/${tokenName}${hash || location.hash}` : ''}`
export const parseDOIDFromRouter = async (...args: string[]): Promise<[DOIDObject, string]> => {
  const key = getKeyFromRouter(...args)
  return [await parseFromString(key), key]
}
//
export const stringify = (doidObject: DOIDObject, { keepIdentifier = false, encode = false } = {}) => {
  let { name, token } = doidObject
  if (!name) return ''
  name = wrapTLD(name)
  let { name: tokenName = '', tokenID = '', sequence = '' } = token ?? {}
  if (encode) {
    tokenName = safeEncodeURIComponent(tokenName)
  }
  sequence = sequence ? `-${sequence}` : tokenID && keepIdentifier ? '-' : ''
  tokenID = tokenID ? `#${tokenID}` : tokenName && keepIdentifier ? '#' : ''
  tokenName = tokenName ? `/${tokenName}` : name && keepIdentifier ? '/' : ''
  return `${name}${tokenName}${tokenID}${sequence}`
}

export const DOIDParser = async (src: string | DOIDObject) => {
  const parsed: DOIDObject = {}
  if (typeof src === 'string') {
    src = safeDecodeURIComponent(src)
    Object.assign(parsed, await parseFromString(<string>src))
  }
  return {
    parseFromString,
    parse: parseFromString,
    stringify: (opts?: stringifyOptions) => stringify(parsed, opts),
    get parsed() {
      return parsed
    }
  }
}
export default DOIDParser
