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
  let result = /^(.*?)[ #](\d*)$/.exec(token.name ?? '')
  if (result) {
    token.slugName = safeEncodeURIComponent(result[1])
    if (result[2] != token.tokenID) {
      token.slugID = result[2].replace(/^0*/, '')
    }
  } else {
    token.slugName = safeEncodeURIComponent(token.name ?? '')
  }
  const val = stringify(cooked)
  const equal = decoded === val
  if (equal && name) token.minter = await reverseDOIDName(name)
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
  const [, tokenName = '', , slugID = '', , tokenID = ''] = tokenish.match(/^(.+?)(#(\d+?)(-(\d+)?)?)?$/) ?? []
  const token: NFTToken = {
    name: tokenName,
    slugID,
    tokenID: tokenID.length == 0 ? slugID : tokenID
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
  let { slugName: tokenName = '', tokenID = '', slugID = '' } = token ?? {}
  if (encode) {
    tokenName = safeEncodeURIComponent(tokenName)
  }
  tokenID = tokenID && tokenID != slugID ? `-${tokenID}` : tokenID && keepIdentifier ? '-' : ''
  slugID = slugID ? `#${slugID}` : tokenName && keepIdentifier ? '#' : ''
  tokenName = tokenName ? `/${tokenName}` : name && keepIdentifier ? '/' : ''
  return `${name}${tokenName}${slugID}${tokenID}`
}

export const parseFromColl = async (coll: any): Promise<DOIDObject> => {
  const DOIDName = coll.name ?? coll.DOIDName
  const decoded = safeDecodeURIComponent(DOIDName)
  const token = coll.token ?? { name: coll.tokenName, tokenID: coll.tokenID, slugID: coll.slugID }
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
