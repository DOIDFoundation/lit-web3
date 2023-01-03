import { checkDOIDName, wrapTLD } from '../nsResolver/checker'
import { safeDecodeURIComponent } from '@lit-web3/core/src/uri'

// eg. packages/tests/test/ethers/nameParser.test.ts
export const parseString = async (str = ''): Promise<DOIDObject> => {
  str = safeDecodeURIComponent(str)
  const { DOIDName, Token } = (str.match(/^(?<DOIDName>[^\/]+?)\/(?<Token>.*)$/) || {}).groups ?? {}
  // DOIDName
  const DOID = await checkDOIDName(DOIDName, { wrap: true })
  // Token
  const [tokenName, tokenIDs = ''] = Token.split('#')
  const { tokenID = '', sequence = '' } = (tokenIDs.match(/^(?<tokenID>\d+)-?(?<sequence>\d+)?$/) || {}).groups ?? {}
  const token = {
    name: tokenName,
    tokenID,
    sequence
  }
  return { DOID, name: DOID.name, token }
}
//
export const stringify = (doidObject: DOIDObject) => {
  let { name, token } = doidObject
  let res = wrapTLD(name)
  if (!token) return res
  const { name: tokenName, tokenID, sequence } = token
  res = `${res}/${tokenName}`
  if (!tokenID) return res
  return `${res}#${tokenID}${sequence ? `-${sequence}` : ''}`
}

export const DOIDNameParser = async (src: string | DOIDObject) => {
  const parsed: DOIDObject = {}
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
