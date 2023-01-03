import { checkDOIDName, wrapTLD } from '../nsResolver/checker'
import { safeDecodeURIComponent } from '@lit-web3/core/src/uri'

// eg. packages/tests/test/ethers/nameParser.test.ts
export const parseDOIDString = async (src = ''): Promise<DOIDObject> => {
  const decoded = safeDecodeURIComponent(src)
  const [, DOIDName, tokenish = ''] = decoded.match(/^([^\/]+)?\/?(.+)?$/) || []
  // DOIDName
  const DOID = await checkDOIDName(DOIDName)
  let { error, msg, name } = DOID
  // Token
  const [tokenName, tokenIDs = ''] = tokenish.split('#')
  const [, tokenID = '', sequence = ''] = tokenIDs.match(/^(\d+)-?(\d+)?$/) || []
  const token = {
    name: tokenName,
    tokenID,
    sequence
  }
  const parsed = { DOID, name, token, error, msg }
  const val = stringify(parsed)
  console.log(decoded, val)
  return { ...parsed, val, consistent: decoded === val }
}
export const parseDOIDURI = async (name = '', tokenName = '', hash = location.hash) => {
  const tokenish = tokenName ? `/${tokenName}${hash}` : ''
  return await parseDOIDString(`${name}${tokenish}`)
}
//
type stringifyOptions = {
  keepIdentifier: boolean
}
export const stringify = (doidObject: DOIDObject, { keepIdentifier = false } = {}) => {
  let { name, token } = doidObject
  name = wrapTLD(name)
  let { name: tokenName = '', tokenID = '', sequence = '' } = token ?? {}
  sequence = sequence ? `-${sequence}` : tokenID && keepIdentifier ? '-' : ''
  tokenID = tokenID ? `#${tokenID}` : tokenName && keepIdentifier ? '#' : ''
  tokenName = tokenName ? `/${tokenName}` : name && keepIdentifier ? '/' : ''
  return `${name}${tokenName}${tokenID}${sequence}`
  // let res = wrapTLD(name)
  // if (!token?.name) return res
  // const { name: tokenName, tokenID, sequence } = token
  // res = `${res}/${tokenName}`
  // if (!sequence) return `${res}${tokenID ? `#${tokenID}` : keepIdentifier ? '#' : ''}`
  // return `${res}#${tokenID}${sequence ? `-${sequence}` : keepIdentifier ? '-' : ''}`
}

export const DOIDNameParser = async (src: string | DOIDObject) => {
  const parsed: DOIDObject = {}
  if (typeof src === 'string') {
    src = safeDecodeURIComponent(src)
    Object.assign(parsed, await parseDOIDString(<string>src))
  }

  return {
    parseDOIDString,
    parse: parseDOIDString,
    stringify: (opts?: stringifyOptions) => stringify(parsed, opts),
    get parsed() {
      return parsed
    }
  }
}
export default DOIDNameParser
