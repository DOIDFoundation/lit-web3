import { checkDOIDName, wrapTLD } from '../nsResolver/checker'
import { safeDecodeURIComponent, slugify } from '@lit-web3/core/src/uri'
import { reverseDOIDName } from './query'

const cookeDOID = async (DOIDName: string, token: NFTToken, decoded: string): Promise<DOIDObject> => {
  // DOIDName
  const DOID = await checkDOIDName(DOIDName)
  let { error, msg, name, doid } = DOID
  // Cook
  const cooked: DOIDObject = { DOID, name, doid, token, error, msg }
  // Generate slugName
  const { name: tokenName } = token
  let { tokenID, slugID } = token
  if (tokenName && !token.slugName) {
    let slugName = slugify(tokenName)
    let [, nameWithoutSuffixID, , , suffixID] = tokenName.match(/^(.+?)(( |#| #)(\d+?))?$/) ?? []
    if (!tokenID && !slugID) {
      // keep as-is, eg. Cyberpunk 2077 >> cyberpunk-2077
    } else {
      if (slugID) {
        if (!tokenID) token.tokenID = slugID
      } else if (tokenID && suffixID) {
        // eg. { name: 'Cyberpunk 2077', tokenID: '2077' } >> cyberpunk#2077
        slugName = slugify(nameWithoutSuffixID)
        token.slugID = suffixID
      }
    }
    token.slugName = slugName
  }
  //
  const val = stringify(cooked) // This will be deprecated soon
  const equal = decoded === val
  if (equal && name) token.minter = await reverseDOIDName(name)
  Object.assign(cooked, {
    val, // This will be deprecated soon
    equal,
    uri: stringify(cooked, { encode: true })
  })
  return cooked
}

// eg. packages/tests/test/ethers/nameParser.test.ts
export const parseFromString = async (src = ''): Promise<DOIDObject> => {
  const decoded = safeDecodeURIComponent(src)
  const [, DOIDName = '', , tokenish = ''] = decoded.match(/^([^\/]+?)(\/(.+)?)?$/) ?? []
  // Generate token
  const [, name = '', , slugID = '', , tokenID = ''] = tokenish.match(/^(.+?)(#(\d+?)(-(\d+)?)?)?$/) ?? []
  const token: NFTToken = {
    name,
    slugID,
    tokenID: tokenID || slugID
  }
  return await cookeDOID(DOIDName, token, decoded)
}

// @lit-labs/router maybe buggy here, if use it's goto('ab#1'), # will be encoded to %23
export const getKeyFromRouter = (name = '', tokenName = '', hash = '') => {
  ;[, tokenName] = location.href.split(name) ?? []
  return `${name}${tokenName ? `/${tokenName.replace(/^\//, '')}` : ''}`
}
export const parseDOIDFromRouter = async (...args: string[]): Promise<[DOIDObject, string]> => {
  const key = getKeyFromRouter(...args)
  return [await parseFromString(key), key]
}
// DOIDObject to string
export const stringify = (doidObject: DOIDObject, { keepIdentifier = false, encode = false } = {}) => {
  let { name: DOIDName, token } = doidObject
  if (!DOIDName) return ''
  DOIDName = wrapTLD(DOIDName)
  let { slugName: tokenName = '', tokenID = '', slugID = '' } = token ?? {}
  if (encode) tokenName = slugify(tokenName)
  // collapse tokenID to slugID
  if ((tokenID && !slugID) || tokenID === slugID) {
    slugID = tokenID
    tokenID = ''
  }
  // tokenID
  if (tokenID && slugID && tokenID != slugID) tokenID = `-${tokenID}`
  else if (keepIdentifier) tokenID = '-'
  // slugID
  if (slugID) slugID = `#${slugID}`
  else if (keepIdentifier && tokenName) slugID = '#'
  // tokenName
  if (tokenName) tokenName = `/${tokenName}`
  else if (keepIdentifier && DOIDName) tokenName = '/'
  return `${DOIDName}${tokenName}${slugID}${tokenID}`
}

export const parseFromColl = async (coll: any): Promise<DOIDObject> => {
  const DOIDName = coll.name ?? coll.DOIDName
  const decoded = safeDecodeURIComponent(DOIDName)
  const token = coll.token ?? { name: coll.tokenName, tokenID: coll.tokenID }
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
