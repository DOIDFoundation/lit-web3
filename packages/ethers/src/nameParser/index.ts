import { checkDOIDName, wrapTLD } from '../nsResolver/checker'
import safeDecodeURIComponent from 'safe-decode-uri-component'

//
export const parseString = async (str = '') => {
  str = safeDecodeURIComponent(str)
  const { DOIDName, item } = (str.match(/^(?<DOIDName>[^\/]+?)\/(?<item>.*)$/) || {}).groups ?? {}
  // DOIDName
  const DOID = await checkDOIDName(DOIDName, { wrap: true })
  // Token
  const [tokenName, tokenIDs = ''] = item.split('#')
  const [tokenID, sequence] = tokenIDs.split('-')
  const token = {
    name: tokenName,
    tokenID,
    sequence
  }
  return { DOID, name: DOID.name, token }
}
//
export const stringify = (doidNameObject: DOIDNameObject) => {
  let { name, token } = doidNameObject
  let res = wrapTLD(name)
  if (!token) return res
  const { name: tokenName, tokenID, sequence } = token
  res = `${res}/${tokenName}`
  if (!tokenID) return res
  return `${res}#${tokenID}${sequence ? `-${sequence}` : ''}`
}

export const DOIDNameParser = async (src: string | DOIDNameObject) => {
  const parsed: DOIDNameObject = {}
  if (typeof src === 'string') {
    src = safeDecodeURIComponent(src)
    Object.assign(parsed, await parseString(<string>src))
  }

  return {
    parseString,
    parse: parseString,
    stringify: () => stringify(parsed),
    get parsed() {
      return parsed
    }
  }
}
export default DOIDNameParser
