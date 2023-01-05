import { checkDOIDName, wrapTLD } from '../nsResolver/checker'
import { safeDecodeURIComponent, safeEncodeURIComponent } from '@lit-web3/core/src/uri'
import slugify from '@lit-web3/core/src/slugify'
import { reverseDOIDName } from './query'

const cookeDOID = async (DOIDName: string, token: NFTToken, decoded: string): Promise<DOIDObject> => {
  // DOIDName
  const DOID = await checkDOIDName(DOIDName)
  let { error, msg, name, doid } = DOID
  // Cook
  const cooked: DOIDObject = { DOID, name, doid, token, error, msg }
  token.slugName = slugify(token.name ?? '')
  const val = stringify(cooked)
  const equal = decoded === val
  if (equal) token.minter = await reverseDOIDName(name)
  Object.assign(cooked, {
    val,
    equal,
    uri: stringify(cooked, { encode: true })
  })
  return cooked
}

// eg. packages/tests/test/ethers/nameParser.test.ts
export const parseFromString = async (src = ''): Promise<DOIDObject> => {
  const decoded = safeDecodeURIComponent(src)
  const [, DOIDName, , tokenish = ''] = decoded.match(/^([^\/]+?)(\/(.+)?)?$/) ?? []
  // Token
  const [, tokenName = '', , tokenID = '', , sequence = ''] = tokenish.match(/^(.+?)(#(\d+?)(-(\d+)?)?)?$/) ?? []
  const token: NFTToken = {
    name: tokenName,
    tokenID,
    sequence
  }
  return await cookeDOID(DOIDName, token, decoded)
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

export const parseFromColl = async (coll: any): Promise<DOIDObject> => {
  const DOIDName = coll.name ?? coll.DOIDName
  const decoded = safeDecodeURIComponent(DOIDName)
  const token = coll.token ?? { name: coll.tokenName, tokenID: coll.tokenID, sequence: coll.sequence }
  return await cookeDOID(DOIDName, token, decoded)
}

export const parse = async <T>(src: T): Promise<DOIDObject> => {
  return await (typeof src === 'string' ? parseFromString(<string>src) : parseFromColl(src))
}

export const DOIDParser = async <T>(src: T) => {
  const parsed = await parse(src)
  return {
    parse,
    parseFromString,
    parseFromColl,
    stringify: (opts?: stringifyOptions) => stringify(parsed, opts),
    get parsed() {
      return parsed
    }
  }
}
export default DOIDParser
